import React, { useCallback, useMemo } from "react";
import styles from "./Profile.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { useDisclosure } from "@nextui-org/modal";
import Delete from "../Delete/Delete";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { resetAISettings } from "@/store/aiSlice";
import { resetChat } from "@/store/chatSlice";
import { resetAuth, selectUserDetailsState } from "@/store/authSlice";

import User from "../../../public/svgs/sidebar/User.svg";

type Props = {
  close: () => void;
};

const Profile = (props: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userDetails = useSelector(selectUserDetailsState);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = useCallback(async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      await auth.signOut();
      props.close();
      dispatch(resetAISettings());
      dispatch(resetChat());
      dispatch(resetAuth());
      router.push("/");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  }, [dispatch, props.close, router]);

  const handleDelete = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onOpen();
  }, [onOpen]);

  const profileData = useMemo(() => ({
    name: userDetails.name,
    email: userDetails.email,
    profilePic: userDetails.profilePic || User
  }), [userDetails.name, userDetails.email, userDetails.profilePic]);

  return (
    <div className={styles.list}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>Profile</div>
      </div>
      <ScrollShadow
        isEnabled={false}
        hideScrollBar
        className="h-[calc(100vh_-_56px)] w-full"
      >
        <div className={styles.listContainer}>
          <div className={styles.profile}>
            <Image
              src={profileData.profilePic}
              width={150}
              height={150}
              alt="Profile Empty"
              className={styles.profileImage}
            />
            <div className={styles.profileTextContainer}>
              <div className={styles.profileHeader}>Name</div>
              <div className={styles.profileText}>{profileData.name}</div>
              <div className={styles.profileHeader}>Email</div>
              <div className={styles.profileText}>{profileData.email}</div>
            </div>
          </div>
          <div className={styles.bottomContainer}>
            <div onClick={handleLogout} className={styles.button}>
              Log Out
            </div>
            <div onClick={handleDelete} className={styles.deleteButton}>
              Delete Account
            </div>
          </div>
        </div>
      </ScrollShadow>
      <Delete isOpen={isOpen} onClose={onClose} delete={handleLogout} />
    </div>
  );
};

export default Profile;
