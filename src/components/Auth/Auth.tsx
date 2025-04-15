import React, { useState } from "react";
import styles from "./Auth.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal, ModalContent } from "@nextui-org/modal";
import { useDispatch } from "react-redux";
import { setAuthState, setUserDetailsState } from "@/store/authSlice";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import dynamic from 'next/dynamic';
import { wechatConfig } from "@/config/wechatConfig";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const Auth = (props: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      // 检查数据库连接
      if (!db) {
        throw new Error('数据库连接失败');
      }

      // 使用固定的测试账号信息
      const mockUserInfo = {
        openid: 'test_user_001',
        nickname: '测试用户',
        headimgurl: 'https://example.com/default-avatar.png',
      };

      // 保存用户信息到Firebase
      const userRef = doc(db, 'users', mockUserInfo.openid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await setDoc(
          userRef,
          {
            userDetails: {
              name: mockUserInfo.nickname,
              profilePic: mockUserInfo.headimgurl,
            },
          },
          { merge: true }
        );
      } else {
        await setDoc(userRef, {
          userDetails: {
            name: mockUserInfo.nickname,
            profilePic: mockUserInfo.headimgurl,
            createdAt: serverTimestamp(),
          },
        });
      }

      // 更新Redux状态
      dispatch(setAuthState(true));
      dispatch(
        setUserDetailsState({
          uid: mockUserInfo.openid,
          name: mockUserInfo.nickname,
          email: '',
          profilePic: mockUserInfo.headimgurl,
        })
      );
      router.push('/');
    } catch (error) {
      console.error("登录失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      size={"lg"}
      radius="md"
      shadow="sm"
      backdrop={"blur"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      placement="bottom-center"
      closeButton={<div></div>}
    >
      <ModalContent>
        {(onClose) => (
          <div className={styles.modal}>
            <div className={styles.titleContainer}>
              <div className={styles.title}></div>
              <div
                className={styles.close}
                onClick={() => {
                  onClose();
                }}
              >
                <Image
                  width={20}
                  height={20}
                  src={"/svgs/CrossWhite.svg"}
                  alt={"X"}
                />
              </div>
            </div>
            <div className={styles.container}>
              <div className={styles.title}>Welcome</div>
              <p className={styles.text}>Let&apos;s Create Your Account</p>

              {loading ? (
                <div className={styles.button}>
                  <div className={styles.spinner}>
                    <Spinner />
                  </div>
                  <div className={styles.buttonText}>Signing in</div>
                </div>
              ) : (
                <div className={styles.button} onClick={handleAuth}>
                  <Image
                    src={"/svgs/WeChat.svg"}
                    alt={"WeChat"}
                    width={24}
                    height={24}
                  />
                  <div className={styles.buttonText}>Continue with WeChat</div>
                </div>
              )}
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Auth;

const Spinner = dynamic(() => import("../Spinner/Spinner"), {
  loading: () => <div className={styles.spinner}>Loading...</div>,
  ssr: false
});
