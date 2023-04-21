import Head from "next/head";
import React from "react";
import { EditorContextProvider } from "../components/markdown/context/EditorContext";
import EditorPage from "../components/markdown/pages/EditorPage/EditorPage";

export default function Create() {
  return (
    <div>
      <Head>
        <title>Create</title>
      </Head>
      {/* @ts-ignore */}
      <EditorContextProvider>
        <EditorPage />
      </EditorContextProvider>
    </div>
  );
}
