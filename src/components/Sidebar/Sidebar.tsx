"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Sidebar.module.css";
import Image from "next/image";
import History from "../History/History";
import Library from "../Library/Library";
import Plugins from "../Plugins/Plugins";
import Profile from "../Profile/Profile";
import Auth from "../Auth/Auth";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/store/authSlice";
import { useDisclosure } from "@nextui-org/modal";

import Logo from "../../../public/Logo.svg";
import Menu from "../../../public/svgs/Menu.svg";
import Pen from "../../../public/svgs/Pen.svg";
import Chat from "../../../public/svgs/sidebar/Chat_Active.svg";
import ChatInactive from "../../../public/svgs/sidebar/Chat_Inactive.svg";
import Folder from "../../../public/svgs/sidebar/Folder_Active.svg";
import FolderInactive from "../../../public/svgs/sidebar/Folder_Inactive.svg";
import Plugin from "../../../public/svgs/sidebar/Plugin_Active.svg";
import PluginInactive from "../../../public/svgs/sidebar/Plugin_Inactive.svg";
import User from "../../../public/svgs/sidebar/User.svg";
import Collapse from "../../../public/svgs/sidebar/Collapse.svg";

const Sidebar = () => {
  const router = useRouter();
  const authState = useSelector(selectAuthState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState("history");

  const [width, setWidth] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(width >= 512);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    if (width <= 512) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef, width, setIsSidebarOpen]);

  useEffect(() => {
    if (!authState) {
      setSelected("history");
    }
  }, [authState]);

  const closeSidebar = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsSidebarOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const toggleSidebar = () => {
    if (isSidebarOpen) {
      closeSidebar();
    } else {
      setIsSidebarOpen(true);
      setIsClosing(false);
    }
  };

  const handleProfileClick = () => {
    if (authState) {
      setSelected("profile");
    } else {
      closeSidebar();
      onOpen();
    }
  };

  const handleNewChat = () => {
    router.push("/");
  };

  return (
    <>
      <div className={styles.header}>
        <div onClick={toggleSidebar} className={styles.menu}>
          <Image priority={true} src={Menu} alt="Menu" width={24} height={24} />
        </div>
        <div
          className={styles.titleButton}
          style={{ opacity: isSidebarOpen ? 0 : 1 }}
          onClick={handleNewChat}
        >
          <Image
            priority={true}
            src={Pen}
            alt={"Pen"}
            width={20}
            height={20}
            className={styles.titleButtonIcon}
          />
          <p className={styles.titleButtonText}>New Chat</p>
        </div>
      </div>
      {isSidebarOpen && (
        <>
          <div
            ref={sidebarRef}
            className={`${styles.container} ${
              isSidebarOpen && !isClosing ? styles.opening : ""
            } ${isClosing ? styles.closing : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.barContainer}>
              <Image src={Logo} alt="Logo" className={styles.logo} loading="lazy" onClick={() => {
                closeSidebar();
                router.push("/");
              }}/>
              <div className={styles.iconContainer}>
                <div>
                  <Image
                    src={Collapse}
                    alt="Collapse"
                    // title="collapse"
                    className={styles.icon}
                    onClick={closeSidebar}
                  />
                  {selected === "history" ? (
                    <Image
                      src={Chat}
                      alt="History"
                      className={styles.iconActive}
                    />
                  ) : (
                    <Image
                      src={ChatInactive}
                      alt="History"
                      className={styles.icon}
                      onClick={() => setSelected("history")}
                    />
                  )}
                  {/* {selected === "library" ? (
                    <Image
                      src={Folder}
                      alt="Library"
                      className={styles.iconActive}
                    />
                  ) : (
                    <Image
                      src={FolderInactive}
                      alt="Library"
                      className={styles.icon}
                      onClick={() => setSelected("library")}
                    />
                  )}
                  {selected === "plugins" ? (
                    <Image
                      src={Plugin}
                      alt="Plugins"
                      className={styles.iconActive}
                    />
                  ) : (
                    <Image
                      src={PluginInactive}
                      alt="Plugins"
                      className={styles.icon}
                      onClick={() => setSelected("plugins")}
                    />
                  )} */}
                </div>
                <div>
                  <Image
                    src={User}
                    alt="Profile"
                    className={
                      selected === "profile" ? styles.iconActive : styles.icon
                    }
                    style={{ marginBottom: 0 }}
                    onClick={handleProfileClick}
                  />
                </div>
              </div>
            </div>
            <div className={styles.mainContainer}>
              {selected === "history" ? (
                <History />
              ) : /* selected === "library" ? (
                <Library />
              ) : selected === "plugins" ? (
                <Plugins closeSidebar={closeSidebar} />
              ) : */ (
                <Profile close={closeSidebar} />
              )}
            </div>
          </div>
          {width <= 512 && (
            <div
              className={`${styles.mobileOverlay} ${
                isClosing ? styles.mobileOverlayClosing : null
              }`}
            />
          )}
        </>
      )}
      <Auth isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Sidebar;