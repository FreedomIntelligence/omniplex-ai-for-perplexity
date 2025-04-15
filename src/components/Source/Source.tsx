import React from "react";
import Image from "next/image";
import styles from "./Source.module.css";
import File from "../File/File";
import Search from "../Search/Search";
// 暂时注释掉Stock导入，因为Stock.tsx模块存在问题
// import Stock from "../Stock/Stock";
import Widget from "../Widget/Widget";
import Dictionary from "../Dictionary/Dictionary";
import {
  FileInfo,
  SearchType,
  StockType,
  DictionaryType,
} from "@/utils/types";

import SourceLogo from "../../../public/svgs/Source.svg";

type Props = {
  mode: string;
  fileInfo?: FileInfo;
  searchResults?: SearchType;
  stockResults?: StockType;
  dictionaryResults?: DictionaryType;
};

const Source = (props: Props) => {
  if (props.mode !== "chat") {
    return (
      <div className={styles.sourceContainer}>
        <div className={styles.sourceTextRow}>
          <Image src={SourceLogo} alt="Source" className={styles.sourceImg} />
          <p className={styles.sourceText}>Source</p>
        </div>

        {props.mode === "image" && (
          <div className={styles.sourceRow}>
            <File fileInfo={props.fileInfo} />
          </div>
        )}

        {props.mode === "search" && (
          <div>
            <Search searchResults={props.searchResults} />
            <Widget searchResults={props.searchResults} />
          </div>
        )}

        {props.mode === "stock" && (
          <div className={styles.sourceRow}>
            {/* 暂时注释掉Stock组件，等Stock模块问题修复后再启用 */}
            {/* <Stock stockResults={props.stockResults} /> */}
          </div>
        )}

        {props.mode === "dictionary" && (
          <div className={styles.sourceRow}>
            <Dictionary dictionaryResults={props.dictionaryResults} />
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default Source;
