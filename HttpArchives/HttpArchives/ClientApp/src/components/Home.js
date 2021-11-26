import React, { useRef, useState } from 'react';
import {
    TreeView,
    TreeViewDragClue,
    processTreeViewItems,
    moveTreeViewItem,
    TreeViewDragAnalyzer,
} from "@progress/kendo-react-treeview";
import { NetworkViewer } from 'network-viewer';
import "./Home.css"
const SEPARATOR = "_";
const treeData = [
    {
        text: "Furniture",
        items: [
            {
                text: "My Folder",
            },
            {
                text: "Sofas",
            },
            {
                text: "Occasional Furniture",
                items: [
                    {
                        text: "Test Folder",
                    },
                    {
                        text: "Progress",
                    },
                ]
            },
        ],
    },
    {
        text: "Decor",
        items: [
            {
                text: "Bed Linen",
            },
            {
                text: "Curtains & Blinds",
            },
            {
                text: "Carpets",
                items: [
                    {
                        text: "test1.har",
                    },
                    {
                        text: "test2.har",
                    },
                    {
                        text: "test3.har",
                    }
                ],
            },
        ],
    },
];
function getSiblings(itemIndex, data) {
    let result = data;
    const indices = itemIndex.split(SEPARATOR).map((index) => Number(index));

    for (let i = 0; i < indices.length - 1; i++) {
        result = result[indices[i]].items || [];
    }

    return result;
}
const Home = () => {
    const fileRef = useRef();
    const [fileData, setFileData] = useState({});
    const [fileName, setFileName] = useState("");
    const [fileDescription, setDescription] = useState("");

    const dragClue = React.useRef();
    const dragOverCnt = React.useRef(0);
    const isDragDrop = React.useRef(false);
    const [tree, setTree] = React.useState(treeData);
    const [expand, setExpand] = React.useState({
        ids: [],
        idField: "text",
    });

    const [select, setSelect] = useState([""]);

    const previewFileInNetworkViewer = async (e) => {
        setFileData(await getHarFileData(e));
    }

    const getHarFileData = (e) => {
        e.preventDefault();
        if (fileRef.current.files.length == 0) {
            alert("Choose HAR file please");
            return;
        }
        let file = fileRef.current.files[0];
        if (!file.name.toLowerCase().endsWith(".har")) {
            alert("This is not a HAR file");
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

    const onItemClick = (event) => {
        if (event.item.text.toLowerCase().endsWith(".har")) {
            return;
        }
        if (!isDragDrop.current) {
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

    const onItemDragEnd = (event) => {
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
        if (!fileName) {
            alert("Fill name field before save HAR file");
            return;
        }
        if (!fileDescription) {
            alert("Fill description field before save HAR file");
            return;
        }
        let fileData = await getHarFileData(e);
        fetch("api/harfile/create", {
            method: "POST",
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({ name: fileName, content: JSON.stringify(fileData), description: fileDescription })
        }).then(res => res.json())
            .then((id) => {

            })
    }

    const handleChangeDescription = (e) => {
        setDescription(e.target.value);
    }
    const handleChangeName = (e) => {
        setFileName(e.target.value);
    }
    return (
        <div>
            <div id="files">
                <div id="bloc1">
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
                <div id="bloc2">
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
            <hr />
            <h1 className="previewer">Previewer</h1>
            <NetworkViewer data={fileData} />
        </div>
    );
};

export default Home;
