"use client";

import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./MainPrompt.module.css";
import Auth from "../Auth/Auth";
import SpinnerWhite from "../SpinnerWhite/SpinnerWhite";
import toast from "react-hot-toast";
import Sheet from "react-modal-sheet";
import { cutString } from "../../utils/utils";
import { focusOptions } from "../../utils/data";
import { FileInfo, Mode, Chat } from "@/utils/types";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@nextui-org/modal";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { createChatThread } from "../../store/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUserDetailsState, selectAuthState } from "@/store/authSlice";
import { setModel } from "@/store/aiSlice";
import { db } from "../../../firebaseConfig";
import { storage } from "../../../firebaseConfig";
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Arrow from "../../../public/svgs/Arrow.svg";
import Filter from "../../../public/svgs/Filter.svg";
import FileActive from "../../../public/svgs/FileActive.svg";
import Clip from "../../../public/svgs/Clip.svg";
import Check from "../../../public/svgs/Check.svg";
import CrossRed from "../../../public/svgs/CrossRed.svg";

const MainPrompt = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const authState = useSelector(selectAuthState);
  const userDetails = useSelector(selectUserDetailsState);
  const userId = userDetails.uid;

  const [text, setText] = useState("");
  const [width, setWidth] = useState(0);
  const [modal, setModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("");
  const [buttonText, setButtonText] = useState("Attach");
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState({
    website: "Model",
    // icon: Filter,
    query: "",
  });

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFocusChange = (
    website: string,
    query: string,
  ) => {
    if (website === "Model") {
      setMode("");
      dispatch(setModel("gpt-4o"));
    } else if (website === "Writing") {
      setMode("chat");
    } else {
      setMode("search");
    }
    // GPT系列
    if (website === "gpt-3.5-turbo") {dispatch(setModel("gpt-3.5-turbo"));}
    if (website === "gpt-3.5-turbo-0125") {dispatch(setModel("gpt-3.5-turbo-0125"));}
    if (website === "gpt-3.5-turbo-0301") {dispatch(setModel("gpt-3.5-turbo-0301"));}
    if (website === "gpt-3.5-turbo-0613") {dispatch(setModel("gpt-3.5-turbo-0613"));}
    if (website === "gpt-3.5-turbo-1106") {dispatch(setModel("gpt-3.5-turbo-1106"));}
    if (website === "gpt-3.5-turbo-16k") {dispatch(setModel("gpt-3.5-turbo-16k"));}
    if (website === "gpt-3.5-turbo-16k-0613") {dispatch(setModel("gpt-3.5-turbo-16k-0613"));}
    if (website === "gpt-4") {dispatch(setModel("gpt-4"));}
    if (website === "gpt-4-0125-preview") {dispatch(setModel("gpt-4-0125-preview"));}
    if (website === "gpt-4-0314") {dispatch(setModel("gpt-4-0314"));}
    if (website === "gpt-4-0613") {dispatch(setModel("gpt-4-0613"));}
    if (website === "gpt-4-1106-preview") {dispatch(setModel("gpt-4-1106-preview"));}
    if (website === "gpt-4-32k") {dispatch(setModel("gpt-4-32k"));}
    if (website === "gpt-4-32k-0314") {dispatch(setModel("gpt-4-32k-0314"));}
    if (website === "gpt-4-32k-0613") {dispatch(setModel("gpt-4-32k-0613"));}
    if (website === "gpt-4-turbo") {dispatch(setModel("gpt-4-turbo"));}
    if (website === "gpt-4-turbo-2024-04-09") {dispatch(setModel("gpt-4-turbo-2024-04-09"));}
    if (website === "gpt-4-turbo-preview") {dispatch(setModel("gpt-4-turbo-preview"));}
    if (website === "gpt-4-vision-preview") {dispatch(setModel("gpt-4-vision-preview"));}
    if (website === "gpt-4.5-preview") {dispatch(setModel("gpt-4.5-preview"));}
    if (website === "gpt-4.5-preview-2025-02-27") {dispatch(setModel("gpt-4.5-preview-2025-02-27"));}
    if (website === "gpt-4o") {dispatch(setModel("gpt-4o"));}
    if (website === "gpt-4o-2024-05-13") {dispatch(setModel("gpt-4o-2024-05-13"));}
    if (website === "gpt-4o-2024-08-06") {dispatch(setModel("gpt-4o-2024-08-06"));}
    if (website === "gpt-4o-2024-11-20") {dispatch(setModel("gpt-4o-2024-11-20"));}
    if (website === "gpt-4o-mini") {dispatch(setModel("gpt-4o-mini"));}
    if (website === "gpt-4o-mini-2024-07-18") {dispatch(setModel("gpt-4o-mini-2024-07-18"));}
    
    // Claude系列
    if (website === "claude-3-5-haiku-20241022") {dispatch(setModel("claude-3-5-haiku-20241022"));}
    if (website === "claude-3-5-sonnet-20240620") {dispatch(setModel("claude-3-5-sonnet-20240620"));}
    if (website === "claude-3-5-sonnet-20241022") {dispatch(setModel("claude-3-5-sonnet-20241022"));}
    if (website === "claude-3-7-sonnet-20250219") {dispatch(setModel("claude-3-7-sonnet-20250219"));}
    if (website === "claude-3-7-sonnet-20250219-thinking") {dispatch(setModel("claude-3-7-sonnet-20250219-thinking"));}
    if (website === "claude-3-opus-20240229") {dispatch(setModel("claude-3-opus-20240229"));}
    
    // Deepseek系列
    if (website === "deepseek-chat") {dispatch(setModel("deepseek-chat"));}
    if (website === "deepseek-r1") {dispatch(setModel("deepseek-r1"));}
    if (website === "deepseek-reasoner") {dispatch(setModel("deepseek-reasoner"));}
    if (website === "deepseek-v3") {dispatch(setModel("deepseek-v3"));}
    
    // 豆包系列
    if (website === "doubao-1-5-lite-32k") {dispatch(setModel("doubao-1-5-lite-32k"));}
    if (website === "doubao-1-5-lite-32k-250115") {dispatch(setModel("doubao-1-5-lite-32k-250115"));}
    if (website === "doubao-1-5-pro-256k-250115") {dispatch(setModel("doubao-1-5-pro-256k-250115"));}
    if (website === "doubao-1-5-pro-32k-250115") {dispatch(setModel("doubao-1-5-pro-32k-250115"));}
    if (website === "doubao-1-5-vision-pro-32k") {dispatch(setModel("doubao-1-5-vision-pro-32k"));}
    if (website === "doubao-1.5-pro-256k") {dispatch(setModel("doubao-1.5-pro-256k"));}
    
    // Gemini系列
    if (website === "gemini-1.5-flash") {dispatch(setModel("gemini-1.5-flash"));}
    if (website === "gemini-1.5-flash-002") {dispatch(setModel("gemini-1.5-flash-002"));}
    if (website === "gemini-1.5-flash-8b") {dispatch(setModel("gemini-1.5-flash-8b"));}
    if (website === "gemini-1.5-flash-exp-0827") {dispatch(setModel("gemini-1.5-flash-exp-0827"));}
    if (website === "gemini-1.5-flash-latest") {dispatch(setModel("gemini-1.5-flash-latest"));}
    if (website === "gemini-1.5-pro") {dispatch(setModel("gemini-1.5-pro"));}
    if (website === "gemini-1.5-pro-002") {dispatch(setModel("gemini-1.5-pro-002"));}
    if (website === "gemini-1.5-pro-exp-0801") {dispatch(setModel("gemini-1.5-pro-exp-0801"));}
    if (website === "gemini-1.5-pro-latest") {dispatch(setModel("gemini-1.5-pro-latest"));}
    if (website === "gemini-2.0-flash") {dispatch(setModel("gemini-2.0-flash"));}
    if (website === "gemini-2.0-flash-001") {dispatch(setModel("gemini-2.0-flash-001"));}
    if (website === "gemini-2.0-flash-exp") {dispatch(setModel("gemini-2.0-flash-exp"));}
    if (website === "gemini-2.0-flash-lite") {dispatch(setModel("gemini-2.0-flash-lite"));}
    if (website === "gemini-2.0-flash-lite-preview-02-05") {dispatch(setModel("gemini-2.0-flash-lite-preview-02-05"));}
    if (website === "gemini-2.0-flash-thinking-exp") {dispatch(setModel("gemini-2.0-flash-thinking-exp"));}
    if (website === "gemini-2.0-flash-thinking-exp-1219") {dispatch(setModel("gemini-2.0-flash-thinking-exp-1219"));}
    if (website === "gemini-2.0-pro-exp-02-05") {dispatch(setModel("gemini-2.0-pro-exp-02-05"));}
    
    // Grok系列
    if (website === "grok-3") {dispatch(setModel("grok-3"));}
    if (website === "grok-3-r1") {dispatch(setModel("grok-3-r1"));}
    if (website === "grok-3-reason") {dispatch(setModel("grok-3-reason"));}
    
    // O1系列
    if (website === "o1") {dispatch(setModel("o1"));}
    if (website === "o1-2024-12-17") {dispatch(setModel("o1-2024-12-17"));}
    if (website === "o1-mini") {dispatch(setModel("o1-mini"));}
    if (website === "o1-mini-2024-09-12") {dispatch(setModel("o1-mini-2024-09-12"));}
    if (website === "o1-preview") {dispatch(setModel("o1-preview"));}
    if (website === "o1-preview-2024-09-12") {dispatch(setModel("o1-preview-2024-09-12"));}
    if (website === "o3-mini") {dispatch(setModel("o3-mini"));}
    if (website === "o3-mini-2025-01-31") {dispatch(setModel("o3-mini-2025-01-31"));}
    
    // 其他模型
    if (website === "qvq-72b-preview") {dispatch(setModel("qvq-72b-preview"));}
    if (website === "qwen-max-2025-01-25") {dispatch(setModel("qwen-max-2025-01-25"));}
    if (website === "qwen-max-latest") {dispatch(setModel("qwen-max-latest"));}
    if (website === "qwen-omni-turbo") {dispatch(setModel("qwen-omni-turbo"));}
    if (website === "qwen-omni-turbo-latest") {dispatch(setModel("qwen-omni-turbo-latest"));}
    if (website === "qwen-plus-latest") {dispatch(setModel("qwen-plus-latest"));}
    
    setFocus({ website, query });
    setOpen(false);
  };


  const handleSend = async () => {
    if (text.trim() !== "") {
      const id = nanoid(10);
      const currentMode = fileInfo ? "image" : mode;
      const chatObject: Chat = {
        mode: currentMode,
        question: text.trim(),
        answer: "",
        query: focus.query,
        ...(fileInfo && { fileInfo }),
      };
      console.log("Chat Mode: ", currentMode);

      if (userId) {
        try {
          console.log("Adding document...", userId);
          const batch = writeBatch(db);
          const historyRef = doc(db, "users", userId, "history", id);
          const indexRef = doc(db, "index", id);
          batch.set(historyRef, {
            chats: [chatObject],
            messages: [],
            createdAt: new Date(),
          });
          batch.set(indexRef, { userId });
          await batch.commit();
          console.log("Documents added successfully.");
        } catch (error) {
          console.error("Error adding document: ", error);
          toast.error("Something went wrong", {
            position: "top-center",
            style: {
              padding: "6px 18px",
              color: "#fff",
              background: "#FF4B4B",
            },
          });
        }
      }

      dispatch(createChatThread({ id, chat: chatObject }));
      router.push(`/chat/${id}`);
    } else return;
  };

  const handleEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey && text.trim() !== "") {
      event.preventDefault();
      handleSend();
    } else if (event.key === "Enter" && event.shiftKey) {
    }
  };

  const handleInput = (e: any) => {
    const target = e.target;
    setText(target.value);
    target.style.height = "auto";
    const maxHeight = 512;
    target.style.height = `${Math.min(target.scrollHeight, maxHeight)}px`;
  };

  const handleFile = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/png,image/jpeg,image/jpg";
    fileInput.addEventListener("change", async () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (
          !file ||
          !(
            file.type === "image/png" ||
            file.type === "image/jpeg" ||
            file.type === "image/jpg"
          )
        ) {
          toast.error("Please select an image file (PNG, JPG, JPEG).", {
            position: "top-center",
            style: {
              padding: "6px 18px",
              color: "#fff",
              background: "#FF4B4B",
            },
          });
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File size should not exceed 5MB.", {
            position: "top-center",
            style: {
              padding: "6px 18px",
              color: "#fff",
              background: "#FF4B4B",
            },
          });
          return;
        }
        setLoading(true);
        setButtonText("Processing");
        try {
          if (userId) {
            const libraryId = nanoid(10);
            const storageRef = ref(
              storage,
              `users/${userId}/library/${libraryId}`
            );
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);

            const newFileInfo: FileInfo = {
              url: url,
              name: file.name,
              size: file.size,
              date: new Date().toLocaleDateString("en-GB"),
            };

            const libraryRef = collection(db, "users", userId, "library");
            await setDoc(doc(libraryRef, libraryId), newFileInfo);

            setFileInfo(newFileInfo);
            setButtonText(file.name);
          } else {
            throw new Error("User not authenticated");
          }
        } catch (error) {
          console.error("Error during the process: ", error);
          toast.error("Something went wrong, try again", {
            position: "top-center",
            style: {
              padding: "6px 18px",
              color: "#fff",
              background: "#FF4B4B",
            },
          });
          setButtonText("Attach");
        } finally {
          setLoading(false);
        }
      } else {
        setButtonText("Attach");
      }
    });

    fileInput.click();
  };

  const handleModal = () => {
    if (authState) {
      handleFile();
    } else {
      setModal("auth");
      onOpen();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Where Knowledge Evolves</div>
      <div className={styles.promptContainer}>
        <textarea
          placeholder="Ask anything..."
          className={styles.promptText}
          value={text}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
        <div className={styles.mainRow}>
          <div className={styles.sectionRow}>
            {width <= 512 && (
              <div className={styles.button} onClick={() => setOpen(true)}>
                {/* <Image src={focus.icon} alt="Filter" width={24} height={24} /> */}
                <p className={styles.buttonText}>{focus.website}</p>
              </div>
            )}
            {width > 512 ? (
              <Popover
                placement={"bottom-start"}
                radius="lg"
                offset={4}
                containerPadding={0}
                isOpen={open}
                onOpenChange={(open) => setOpen(open)}
              >
                <PopoverTrigger>
                  <div className={styles.button}>
                    {/* <Image
                      src={focus.icon}
                      alt="Filter"
                      width={18}
                      height={18}
                    /> */}
                    <p className={styles.buttonText}>{focus.website}</p>
                  </div>
                </PopoverTrigger>
                <PopoverContent className={styles.popoverContainer}>
                  <div className={styles.popover}>
                    {focusOptions.map((option, index) => (
                      <div
                        key={index}
                        className={styles.popoverBlock}
                        onClick={() =>
                          option.website === "All"
                            ? handleFocusChange("Focus", "")
                            : handleFocusChange(
                                option.website,
                                option.query,
                                // option.icon
                              )
                        }
                      >
                        <div className={styles.popoverTitleContainer}>
                          {/* <Image
                            src={option.icon}
                            alt={option.website}
                            width={24}
                            height={24}
                          /> */}
                          <p className={styles.popoverText}>{option.website}</p>
                        </div>
                        <p className={styles.popoverSmallText}>
                          {option.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Sheet
                isOpen={open}
                onClose={() => setOpen(false)}
                detent="content-height"
              >
                <Sheet.Container style={{ background: "#232323" }}>
                  <Sheet.Header />
                  <Sheet.Content>
                    <div className={styles.modal}>
                      {focusOptions.map((option, index) => (
                        <React.Fragment key={index}>
                          <div
                            className={styles.modalBlock}
                            onClick={() =>
                              option.website === "All"
                                ? handleFocusChange("Focus", "")
                                : handleFocusChange(
                                    option.website,
                                    option.query,
                                    // option.icon
                                  )
                            }
                          >
                            <div className={styles.modalRow}>
                              <div className={styles.modalTitleContainer}>
                                {/* <Image
                                  src={option.icon}
                                  alt={option.website}
                                  width={24}
                                  height={24}
                                /> */}
                                <p className={styles.modalText}>
                                  {option.website}
                                </p>
                              </div>
                              {focus.website === option.website && (
                                <Image
                                  src={Check}
                                  alt="Check"
                                  width={30}
                                  height={30}
                                />
                              )}
                            </div>
                            <p className={styles.modalSmallText}>
                              {option.description}
                            </p>
                          </div>
                          {index !== 5 && <div className={styles.divider} />}
                        </React.Fragment>
                      ))}
                    </div>
                  </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onTap={() => setOpen(false)} />
              </Sheet>
            )}
            <div className={styles.button} onClick={handleModal}>
              {loading ? (
                <div className={styles.spinner} style={{ marginTop: -3 }}>
                  <SpinnerWhite />
                </div>
              ) : fileInfo?.url ? (
                <Image
                  src={FileActive}
                  alt="FileActive"
                  width={18}
                  height={18}
                />
              ) : (
                <Image src={Clip} alt="Clip" width={18} height={18} />
              )}
              <p
                className={styles.buttonText}
                style={{ color: fileInfo?.url ? "#35A7FF" : "#ffffff" }}
              >
                {cutString(buttonText, 15)}
              </p>
              {fileInfo?.url && (
                <Image
                  src={CrossRed}
                  alt="CrossRed"
                  className={styles.cross}
                  onClick={(event) => {
                    event.stopPropagation();
                    setButtonText("Attach");
                    setFileInfo(null);
                  }}
                />
              )}
            </div>
          </div>
          <div className={styles.sendButton}>
            <Image
              src={Arrow}
              alt="Arrow"
              width={24}
              height={24}
              onClick={handleSend}
            />
          </div>
        </div>
      </div>
      {modal === "auth" && <Auth isOpen={isOpen} onClose={onClose} />}
    </div>
  );
};

export default MainPrompt;