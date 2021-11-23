import React, { useState } from 'react';
import * as ReactDOM from "react-dom";
import {
    TreeView,
    processTreeViewItems,
    handleTreeViewCheckChange,
} from "@progress/kendo-react-treeview";
import { NetworkViewer } from 'network-viewer';

const tree = [
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
            },
        ],
    },
];

const Home = () => {
    const [check, setCheck] = useState([]);
    const [expand, setExpand] = useState({
        ids: ["Item2"],
        idField: "text",
    });
    const [select, setSelect] = useState([""]);

    const onItemClick = (event) => {
        setSelect([event.itemHierarchicalIndex]);
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

    const onCheckChange = (event) => {
        const settings = {
            singleMode: false,
            checkChildren: false,
            checkParents: false,
        };
        setCheck(handleTreeViewCheckChange(event, check, tree, settings));
    };

    return (
        <div>
        <TreeView
                data={processTreeViewItems(tree, {
                    //select: select,
                    check: check,
                    expand: expand,
                })}
                expandIcons={true}
                onExpandChange={onExpandChange}
                aria-multiselectable={true}
                onItemClick={onItemClick}
                checkboxes={true}
                onCheckChange={onCheckChange}
            />
            <hr />
            <NetworkViewer
                isCORSEnabled={true}
            />
        </div>
    );
};

export default Home;
