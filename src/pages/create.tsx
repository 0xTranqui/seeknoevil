// @ts-nocheck

import React, { useMemo, useState, useCallback } from "react";
import { createEditor, Editor as SlateEditor, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import Link from "next/link";

const toggleFormat = (editor, format) => {
  const isActive = SlateEditor.marks(editor)[format];
  if (isActive) {
    SlateEditor.removeMark(editor, format);
  } else {
    SlateEditor.addMark(editor, format, true);
  }
};

const ToolbarButton = ({ format, label, editor }) => {
    const isActive = (SlateEditor.marks(editor) ?? {})[format];
    return (
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleFormat(editor, format);
        }}
        className={`py-1 px-2 rounded-md border-2 border-gray-300 bg-white text-gray-700 hover:border-gray-400 focus:outline-none ${
          isActive ? "font-bold" : ""
        }`}
      >
        {label}
      </button>
    );
  };

  const addLink = (editor) => {
    const url = "https://example.com"; // You can replace this with a dynamic URL
    const { selection } = editor;
    if (!selection) return;
  
    const link = {
      type: "link",
      url,
      children: [{ text: "example.com" }], // You can replace this with a dynamic label
    };
    Transforms.insertNodes(editor, link);
  };
  
  const LinkButton = ({ editor }) => {
    return (
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          addLink(editor);
        }}
        className="py-1 px-2 rounded-md border-2 border-gray-300 bg-white text-gray-700 hover:border-gray-400 focus:outline-none"
      >
        Hyperlink
      </button>
    );
  };  


const Create = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState([{ type: "paragraph", children: [{ text: "" }] }]);

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    let { children } = props;
    if (props.leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (props.leaf.italic) {
      children = <em>{children}</em>;
    }
    if (props.leaf.underline) {
      children = <u>{children}</u>;
    }
    return <span {...props.attributes}>{children}</span>;
  }, []);

  return (
    <div className="px-10 mt-20 border-2 border-black flex flex-row w-full h-full flex-wrap justify-center">
      <Link href="/" className="text-blue-500 hover:underline w-full">
        Back to Home
      </Link>
      <div className="w-[819px] border-2">
        <div className="border-b-2">
          <ToolbarButton format="bold" label="Bold" editor={editor} />
          <ToolbarButton format="italic" label="Italic" editor={editor} />
          <ToolbarButton format="underline" label="Underline" editor={editor} />
          <LinkButton editor={editor} />
        </div>
        <Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            style={{ minHeight: "calc(100vh - 80px)", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </Slate>
      </div>
    </div>
  );
};

export default Create;