import React, { useRef, useEffect, useState } from 'react';
import {
    TreeView,
    TreeViewDragClue,
    processTreeViewItems,
    moveTreeViewItem,
    TreeViewDragAnalyzer,
} from "@progress/kendo-react-treeview";
import { NetworkViewer } from 'network-viewer';
import "./HttpArchive.css"
import { Container } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import treeData from "../data/treeData.js"
import authService from './api-authorization/AuthorizeService'

const SEPARATOR = "_";

function getSiblings(itemIndex, data) {
    let result = data;
    const indices = itemIndex.split(SEPARATOR).map((index) => Number(index));

    for (let i = 0; i < indices.length - 1; i++) {
        result = result[indices[i]].items || [];
    }

    return result;
}
const HttpArchive = () => {
    const fileRef = useRef();
    const [fileData, setFileData] = useState({});
    const [fileName, setFileName] = useState("");
    const [fileDescription, setDescription] = useState("");
    const [selectedFolder, setSelectedFolder] = useState("");

    const [previewDescription, setPreviewDescription] = useState("");

    const dragClue = React.useRef();
    const dragOverCnt = React.useRef(0);
    const isDragDrop = React.useRef(false);
    const [tree, setTree] = React.useState(JSON.parse(JSON.stringify(treeData)));
    const [expand, setExpand] = React.useState({
        ids: [],
        idField: "text",
    });

    const [select, setSelect] = useState([""]);


    useEffect(() => {
        async function fetchMyAPI() {
            const token = await authService.getAccessToken();
            fetch(`api/harfile/getAllHarFiles`, {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then((res) => {
                    res.forEach((harData) => {
                        addFileToCorrectFolder(harData.name, harData.folderName, tree);
                    })
                },
                )
        }
        fetchMyAPI();
        return () => setTree(treeData);
    }, [])

    const getItemNameByIndex = (itemIndex, data) => {
        let test = data;
        const indices = itemIndex.split("_").map((index) => Number(index));
        for (let i = 0; i < indices.length - 1; i++) {
            test = test[indices[i]].items || [];
        }
        return test[indices[indices.length - 1]].text;
    }

    const addFileToCorrectFolder = (fileName, folderName, data) => {
        data.forEach((obj) => {
            if (obj.text == folderName) {
                if (obj.items) {
                    obj.items.push({ text: fileName });
                }
                else {
                    obj.items = [{ text: fileName }];
                }
                return;
            }
            if (obj.items) {
                addFileToCorrectFolder(fileName, folderName, obj.items);
            }
        })
    }

    const previewFileInNetworkViewer = async (e) => {
        setFileData(await getHarFileData(e));
    }

    const getHarFileData = (e) => {
        e.preventDefault();
        if (fileRef.current.files.length == 0) {
            toast.error("Choose HAR file please.");
            return;
        }
        let file = fileRef.current.files[0];
        if (!file.name.toLowerCase().endsWith(".har")) {
            toast.error("This is not a HAR file.");
            return;
        }
        if (file) {
            return new Promise((resolve, reject) => {
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = (evt) => {
                    resolve(JSON.parse(evt.target.result));
                }
                reader.onerror = (evt) => {
                    reject("error reading file");
                }
            });
        }
    }

    const changeHarFileFolder = async (fileName, folderName) => {
        const token = await authService.getAccessToken();
        fetch("api/harfile/changeFileFolder", {
            method: "POST",
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                name: fileName.trim(),
                folderName: folderName
            })
        })
    }

    const getClueClassName = (event) => {
        const eventAnalyzer = new TreeViewDragAnalyzer(event).init();
        const { itemHierarchicalIndex: itemIndex } = eventAnalyzer.destinationMeta;

        if (eventAnalyzer.isDropAllowed) {
            switch (eventAnalyzer.getDropOperation()) {
                case "child":
                    return "k-i-plus";

                case "before":
                    return itemIndex === "0" || itemIndex.endsWith(`${SEPARATOR}0`)
                        ? "k-i-insert-up"
                        : "k-i-insert-middle";

                case "after":
                    const siblings = getSiblings(itemIndex, tree);
                    const lastIndex = Number(itemIndex.split(SEPARATOR).pop());
                    return lastIndex < siblings.length - 1
                        ? "k-i-insert-middle"
                        : "k-i-insert-down";

                default:
                    break;
            }
        }

        return "k-i-cancel";
    };

    const onItemClick = async (event) => {
        const token = await authService.getAccessToken();
        let fileName = event.item.text;
        if (fileName.toLowerCase().endsWith(".har")) {
            fetch(`api/harfile/GetHarFileContent/${fileName}`, {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(
                    (res) => {
                        setFileData(JSON.parse(res.content));
                        setPreviewDescription(res.description);
                    },
                );
            return;
        }
        if (!isDragDrop.current) {
            setSelectedFolder(fileName);
            setSelect([event.itemHierarchicalIndex]);
        }
    };

    const onItemDragOver = (event) => {
        if (!event.item.text.toLowerCase().endsWith(".har")) {
            return;
        }
        dragOverCnt.current++;
        dragClue.current.show(
            event.pageY + 10,
            event.pageX,
            event.item.text,
            getClueClassName(event)
        );
    };

    const onItemDragEnd = async (event) => {
        if (!event.item.text.toLowerCase().endsWith(".har")) {
            isDragDrop.current = dragOverCnt.current > 0;
            dragOverCnt.current = 0;
            dragClue.current.hide();
            return;
        }
        isDragDrop.current = dragOverCnt.current > 0;
        dragOverCnt.current = 0;
        dragClue.current.hide();
        const eventAnalyzer = new TreeViewDragAnalyzer(event).init();
        if (eventAnalyzer.isDropAllowed) {
            const updatedTree = moveTreeViewItem(
                event.itemHierarchicalIndex,
                tree,
                eventAnalyzer.getDropOperation() || "child",
                eventAnalyzer.destinationMeta.itemHierarchicalIndex
            );
            setTree(updatedTree);
            await changeHarFileFolder(event.item.text, getItemNameByIndex(eventAnalyzer.destinationMeta.itemHierarchicalIndex, tree));
        }
    };

    const onExpandChange = (event) => {
        let ids = expand.ids.slice();
        const index = ids.indexOf(event.item.text);
        index === -1 ? ids.push(event.item.text) : ids.splice(index, 1);
        setExpand({
            ids,
            idField: "text",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fileName.trim()) {
            toast.error("Fill Name field please.");
            return;
        }
        if (!fileDescription.trim()) {
            toast.error("Fill Description field please.");
            return;
        }
        if (!selectedFolder) {
            toast.error("Select folder please.");
            return;
        }
        if (fileName.trim().length > 100) {
            toast.error("File Name should be under 100 symbols.");
            return;
        }
        if (fileDescription.trim().length > 500) {
            toast.error("Description Name should be under 500 symbols.");
            return;
        }
        let fileData = await getHarFileData(e);
        if (!fileData) {
            return;
        }
        const token = await authService.getAccessToken();
        fetch("api/harfile/create", {
            method: "POST",
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: fileName.toLocaleLowerCase().endsWith(".har") ? fileName.trim() : fileName.trim() + ".har",
                content: JSON.stringify(fileData),
                description: fileDescription,
                folderName: selectedFolder
            })
        }).then(res => res.json())
            .then((res) => {
                document.getElementById("saveHar").reset();
                toast.success("Successfully saved HAR file");
                addFileToCorrectFolder(res.name, res.folderName, tree);
            }).catch(() => {
                toast.error("Error while saving Har file");
            });
    }

    const handleChangeDescription = (e) => {
        setDescription(e.target.value);
    }

    const handleChangeName = (e) => {
        setFileName(e.target.value);
    }

    return (
        <div>
            <ToastContainer />
            <Container>
                <div id="files">
                    <div id="treeView">
                        <TreeView
                            draggable={true}
                            onItemDragOver={onItemDragOver}
                            onItemDragEnd={onItemDragEnd}
                            data={processTreeViewItems(tree, {
                                expand: expand,
                                select: select,
                            })}
                            expandIcons={true}
                            onExpandChange={onExpandChange}
                            onItemClick={onItemClick}
                        />
                        <TreeViewDragClue ref={dragClue} />
                    </div>
                    <div id="saveHarForm">
                        <form onSubmit={handleSubmit} id="saveHar">
                            <h1>Save your HAR file</h1>
                            <hr />
                            <input ref={fileRef} type="file" accept=".HAR"></input>
                            <br />
                            <input placeholder="Add file name here..." type="text" onChange={handleChangeName}></input>
                        </form>
                        <textarea placeholder="Add description for your file here..." rows="4" cols="50" form="saveHar" onChange={handleChangeDescription}></textarea>
                        <br />
                        <button type="button" className="btn btn-secondary" onClick={previewFileInNetworkViewer}>Preview before save</button>
                        <input type="submit" className="btn btn-primary" form="saveHar" value="Save"></input>
                    </div>
                </div>
                <h1 className="previewer">Previewer</h1>
                <hr />
                <div className="description">
                <h2 >Description: </h2>
                <h5>{previewDescription}</h5>
                </div>
            </Container>
            <NetworkViewer data={fileData} />
        </div>
    );
};

export default HttpArchive;
