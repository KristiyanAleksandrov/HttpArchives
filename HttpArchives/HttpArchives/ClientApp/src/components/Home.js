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
                text: "Tables & Chairs",
            },
            {
                text: "Sofas",
            },
            {
                text: "Occasional Furniture",
                items: [
                    {
                        text: "Tables & Chairs",
                    },
                    {
                        text: "Tables & Chairs",
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
                        check: false
                    },
                    {
                        text: "test2.har",
                        check: true
                    },
                    {
                        text: "test3.har",
                        check: false
                    },
                    {
                        text: "mockup.jpg",
                    },
                    {
                        text: "Research.pdf",
                    },
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

    // const [select, setSelect] = useState([""]);
    // const onItemClick = (event) => {
    //     setSelect([event.itemHierarchicalIndex]);
    // };

    const previewFileInNetworkViewer = (e) => {
        e.preventDefault();
        let file = fileRef.current.files[0];
        if (!file.name.toLowerCase().endsWith(".har")) {
            alert("This is not a HAR file");
            return;
        }
        console.log(file);
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                console.log(evt.target.result);
                setFileData(JSON.parse(evt.target.result));
            }
            reader.onerror = function (evt) {
                console.log("error reading file");
            }
        }
    }
    const dragClue = React.useRef();
    const dragOverCnt = React.useRef(0);
    const isDragDrop = React.useRef(false);
    const [tree, setTree] = React.useState(treeData);
    const [expand, setExpand] = React.useState({
        ids: [],
        idField: "text",
    });
    const [selected, setSelected] = React.useState({
        ids: [],
        idField: "text",
    });

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

    const onItemClick = (event) => {
        if (!isDragDrop.current) {
            let ids = selected.ids.slice();
            const index = ids.indexOf(event.item.text);
            index === -1 ? ids.push(event.item.text) : ids.splice(index, 1);
            setSelected({
                ids,
                idField: "text",
            });
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
                            select: selected,
                        })}
                        expandIcons={true}
                        onExpandChange={onExpandChange}
                        onItemClick={onItemClick}
                    />
                    <TreeViewDragClue ref={dragClue} />
                </div>
                <div id="bloc2">
                    <form id="saveHar">
                        <h1>Save your HAR file</h1>
                        <hr />
                        <input ref={fileRef} type="file" accept=".HAR" multiple></input>
                    </form>
                    <textarea placeholder="Add description for your file here..." rows="4" cols="50" name="description" form="saveHar"></textarea>
                    <br />
                    <button type="button" className="btn btn-secondary" onClick={previewFileInNetworkViewer}>Preview</button>
                    <input type="submit" className="btn btn-primary" form="saveHar" value="Save"></input>
                </div>
            </div>
            <hr />
            <h1 className="previewer">Previewer</h1>
            <NetworkViewer containerClassName={".width: 100%;"} data={fileData} />
        </div>
    );
};

export default Home;
