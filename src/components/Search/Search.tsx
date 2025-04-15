import React from "react";
import Image from "next/image";
import styles from "./Search.module.css";
import { SearchType } from "@/utils/types";
import { cutString, getSecondLevelDomain } from "../../utils/utils";
import { Skeleton } from "@nextui-org/skeleton";

type SearchProps = {
  searchResults?: SearchType;
};

const Search = ({ searchResults }: SearchProps) => {
  const webPages = searchResults?.data?.webPages?.value || [];

  return (
    <div className={styles.sourceRow}>
      {webPages.length > 0 ? (
        webPages.slice(0, 10).map((item: any, index: number) => (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sourceBox}
            key={index}
          >
            <div className={styles.sourceBoxText}>
              {cutString(item.snippet)}
            </div>
            <div className={styles.sourceBoxRow}>
              <Image
                width={24}
                height={24}
                alt="Favicon"
                src={`/api/favicon?url=${encodeURIComponent(item.url)}`}
                className={styles.sourceFavicon}
              />
              <div className={styles.sourceFaviconText}>
                {cutString(getSecondLevelDomain(item.url), 12)}
              </div>
              <div className={styles.dot} />
              <div className={styles.sourceIndex}>{index + 1}</div>
            </div>
          </a>
        ))
      ) : (
        <>
          <Skeleton className={styles.skeletonBox} />
          <Skeleton className={styles.skeletonBox} />
          <Skeleton className={styles.skeletonBox} />
        </>
      )}
    </div>
  );
};

export default Search;
