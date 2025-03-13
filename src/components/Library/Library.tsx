import React, { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./Library.module.css";
import Image from "next/image";
import Auth from "../Auth/Auth";
import SpinnerWhite from "../SpinnerWhite/SpinnerWhite";
import { Skeleton } from "@nextui-org/skeleton";
import { useDisclosure } from "@nextui-org/modal";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { getRelativeDateLabel, cutString } from "@/utils/utils";
import { LibraryItem } from "@/utils/types";
import { useSelector } from "react-redux";
import { selectAuthState, selectUserDetailsState } from "../../store/authSlice";
import { collection, query, getDocs, orderBy, deleteDoc, doc, limit, startAfter } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

import Bin from "../../../public/svgs/Bin.svg";
import FolderInactive from "../../../public/svgs/sidebar/Folder_Inactive.svg";

const ITEMS_PER_PAGE = 10;

const Library = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isAuthenticated = useSelector(selectAuthState);
  const userDetails = useSelector(selectUserDetailsState);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [libraryData, setLibraryData] = useState<LibraryItem[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchLibraryData = useCallback(async (isInitial = false) => {
    if (isAuthenticated && userDetails.uid) {
      try {
        setLoading(true);
        const libraryRef = collection(db, "users", userDetails.uid, "library");
        let q = query(libraryRef, orderBy("date", "desc"), limit(ITEMS_PER_PAGE));
        
        if (!isInitial && lastDoc) {
          q = query(libraryRef, orderBy("date", "desc"), startAfter(lastDoc), limit(ITEMS_PER_PAGE));
        }

        const querySnapshot = await getDocs(q);
        const library = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as LibraryItem[];

        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);
        
        if (isInitial) {
          setLibraryData(library);
        } else {
          setLibraryData(prev => [...prev, ...library]);
        }
      } catch (error) {
        console.error("Error fetching library data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLibraryData([]);
      setLoading(false);
    }
  }, [isAuthenticated, userDetails.uid, lastDoc]);

  useEffect(() => {
    fetchLibraryData(true);
  }, [isAuthenticated, userDetails.uid]);

  const handleDelete = useCallback(async (itemId: string) => {
    if (isAuthenticated && userDetails.uid) {
      setDeleting(true);
      try {
        await deleteDoc(doc(db, "users", userDetails.uid, "library", itemId));
        setLibraryData(prev => prev.filter(item => item.id !== itemId));
      } catch (error) {
        console.error("Error deleting document:", error);
      } finally {
        setDeleting(false);
      }
    }
  }, [isAuthenticated, userDetails.uid]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchLibraryData();
    }
  }, [loading, hasMore, fetchLibraryData]);

  const groupedLibraryData = useMemo(() => {
    return libraryData.reduce((acc, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {} as Record<string, LibraryItem[]>);
  }, [libraryData]);

  return (
    <div className={styles.list}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>Documents</div>
      </div>
      <ScrollShadow 
        hideScrollBar 
        className="h-[calc(100vh_-_50px)] w-full"
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            handleLoadMore();
          }
        }}
      >
        <div className={styles.listContainer}>
          {loading && libraryData.length === 0 ? (
            <React.Fragment>
              <Skeleton className={styles.skeletonListHeader} />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className={styles.skeletonListItem} />
              ))}
            </React.Fragment>
          ) : libraryData.length === 0 ? (
            <div className={styles.emptyState}>
              <Image
                src={FolderInactive}
                alt="Folder Empty"
                className={styles.emptyStateIcon}
              />
              <p className={styles.emptyStateText}>No Documents Uploaded</p>
            </div>
          ) : (
            Object.entries(groupedLibraryData).map(([date, items]) => (
              <React.Fragment key={date}>
                <div className={styles.listHeader}>
                  {getRelativeDateLabel(date)}
                </div>
                {items.map((item) => (
                  <div key={item.id} className={styles.listItem}>
                    {cutString(item.name, 24)}
                    {deleting ? (
                      <div className={styles.spinner}>
                        <SpinnerWhite />
                      </div>
                    ) : (
                      <Image
                        src={Bin}
                        alt="Bin"
                        className={styles.bin}
                        onClick={() => handleDelete(item.id)}
                      />
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))
          )}
          {loading && libraryData.length > 0 && (
            <div className={styles.loadingMore}>
              <SpinnerWhite />
            </div>
          )}
        </div>
      </ScrollShadow>
      {!isAuthenticated && (
        <div className={styles.modalOverlay}>
          <div className={styles.button} onClick={onOpen}>
            Sign In
          </div>
        </div>
      )}
      <Auth isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default Library;
