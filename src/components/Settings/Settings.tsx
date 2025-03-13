import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import styles from "./Settings.module.css";
import Image from "next/image";
import Auth from "../Auth/Auth";
import { useDisclosure } from "@nextui-org/modal";
import { useDispatch, useSelector } from "react-redux";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Tooltip } from "@nextui-org/tooltip";
import { Select, SelectItem } from "@nextui-org/select";
import { Slider } from "@nextui-org/slider";
import {
  setModel,
  setTemperature,
  setMaxLength,
  setTopP,
  setFrequency,
  setPresence,
  setCustomPrompt,
  selectModel,
  selectTemperature,
  selectMaxLength,
  selectTopP,
  selectFrequency,
  selectPresence,
  selectCustomPrompt,
  resetAISettings,
} from "@/store/aiSlice";
import { selectAuthState } from "@/store/authSlice";
import { MODELS } from "@/utils/data";

import Info from "../../../public/svgs/Info.svg";
import Selector from "../../../public/svgs/Selector.svg";

const Settings = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isAuthenticated = useSelector(selectAuthState);

  const aiModel = useSelector(selectModel);
  const aiTemperature = useSelector(selectTemperature);
  const aiMaxLength = useSelector(selectMaxLength);
  const aiTopP = useSelector(selectTopP);
  const aiFrequency = useSelector(selectFrequency);
  const aiPresence = useSelector(selectPresence);
  const aiCustomPrompt = useSelector(selectCustomPrompt);

  const [localSettings, setLocalSettings] = useState({
    model: aiModel,
    temperature: aiTemperature,
    maxLength: aiMaxLength,
    topP: aiTopP,
    frequency: aiFrequency,
    presence: aiPresence,
    customPrompt: aiCustomPrompt
  });

  const [hasChanges, setHasChanges] = useState(false);
  const initialLoad = useRef(true);

  const updateLocalSetting = useCallback((key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const hasSettingsChanged = useMemo(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return false;
    }
    return (
      aiModel !== localSettings.model ||
      aiTemperature !== localSettings.temperature ||
      aiMaxLength !== localSettings.maxLength ||
      aiTopP !== localSettings.topP ||
      aiFrequency !== localSettings.frequency ||
      aiPresence !== localSettings.presence ||
      aiCustomPrompt !== localSettings.customPrompt.trim()
    );
  }, [localSettings, aiModel, aiTemperature, aiMaxLength, aiTopP, aiFrequency, aiPresence, aiCustomPrompt]);

  useEffect(() => {
    setHasChanges(hasSettingsChanged);
  }, [hasSettingsChanged]);

  useEffect(() => {
    setLocalSettings({
      model: aiModel,
      temperature: aiTemperature,
      maxLength: aiMaxLength,
      topP: aiTopP,
      frequency: aiFrequency,
      presence: aiPresence,
      customPrompt: aiCustomPrompt
    });
  }, [aiModel, aiTemperature, aiMaxLength, aiTopP, aiFrequency, aiPresence, aiCustomPrompt]);

  const handleSaveSetting = useCallback(() => {
    dispatch(setModel(localSettings.model));
    dispatch(setTemperature(localSettings.temperature));
    dispatch(setMaxLength(localSettings.maxLength));
    dispatch(setTopP(localSettings.topP));
    dispatch(setFrequency(localSettings.frequency));
    dispatch(setPresence(localSettings.presence));
    dispatch(setCustomPrompt(localSettings.customPrompt));
    setHasChanges(false);
  }, [dispatch, localSettings]);

  const handleResetSetting = useCallback(() => {
    dispatch(resetAISettings());
  }, [dispatch]);

  return (
    <div className={styles.list}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>Settings</div>
        <div
          className={styles.titleButtonRow}
          style={{ opacity: hasChanges ? 1 : 0 }}
        >
          <div className={styles.titleButton} onClick={handleSaveSetting}>
            <p className={styles.titleButtonText}>Save</p>
          </div>
          <div className={styles.titleButton} onClick={handleResetSetting}>
            <p className={styles.titleButtonText}>Reset</p>
          </div>
        </div>
      </div>
      <ScrollShadow hideScrollBar className="h-[calc(100vh_-_50px)] w-full">
        <div className={styles.listContainer}>
          <div className={styles.listRow}>
            <div className={styles.listHeader}>Model</div>
            <Tooltip
              content="For Images, we only use GPT-4o"
              color={"warning"}
              placement={"bottom-end"}
              className={styles.tooltip}
            >
              <Image
                src={Info}
                alt={"info"}
                width={16}
                height={16}
                className={styles.tooltipIcon}
              />
            </Tooltip>
          </div>
          <Select
            value={localSettings.model}
            onChange={(e) => updateLocalSetting('model', e.target.value)}
            placeholder={localSettings.model}
            labelPlacement="outside"
            className={styles.selector}
            disableSelectorIconRotation
            selectorIcon={<Image src={Selector} alt="Selector" />}
            scrollShadowProps={{
              isEnabled: false,
            }}
            classNames={{
              trigger:
                "rounded-lg bg-[#ffffff14] data-[hover=true]:bg-[#ffffff14]",
              listboxWrapper: "rounded-lg bg-[#ffffff14]",
            }}
            popoverProps={{
              classNames: {
                base: "rounded-lg bg-[#ffffff14]",
                content: "p-0 rounded-lg border-none",
              },
            }}
          >
            {MODELS.map((model) => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))}
          </Select>
          <div className={styles.listRow}>
            <div className={styles.listHeader}>Temperature</div>
            <div className={styles.listHeader}>{localSettings.temperature}</div>
          </div>
          <Slider
            size="sm"
            value={localSettings.temperature}
            onChange={(value) => updateLocalSetting('temperature', Number(value))}
            step={0.01}
            maxValue={2}
            minValue={0}
            defaultValue={localSettings.temperature}
            color="foreground"
            className={styles.slider}
            renderThumb={(props) => <div {...props} className={styles.thumb} />}
          />
          <div className={styles.listRow}>
            <div className={styles.listHeader}>Maximum length</div>
            <div className={styles.listHeader}>{localSettings.maxLength}</div>
          </div>
          <Slider
            size="sm"
            value={localSettings.maxLength}
            onChange={(value) => updateLocalSetting('maxLength', Number(value))}
            step={1}
            maxValue={4096}
            minValue={0}
            defaultValue={localSettings.maxLength}
            color="foreground"
            className={styles.slider}
            renderThumb={(props) => <div {...props} className={styles.thumb} />}
          />
          <div className={styles.listRow}>
            <div className={styles.listHeader}>Top P</div>
            <div className={styles.listHeader}>{localSettings.topP}</div>
          </div>
          <Slider
            size="sm"
            value={localSettings.topP}
            onChange={(value) => updateLocalSetting('topP', Number(value))}
            step={0.01}
            maxValue={1}
            minValue={0}
            defaultValue={localSettings.topP}
            color="foreground"
            className={styles.slider}
            renderThumb={(props) => <div {...props} className={styles.thumb} />}
          />
          <div className={styles.listRow}>
            <div className={styles.listHeader}>Frequency penalty</div>
            <div className={styles.listHeader}>{localSettings.frequency}</div>
          </div>
          <Slider
            size="sm"
            value={localSettings.frequency}
            onChange={(value) => updateLocalSetting('frequency', Number(value))}
            step={0.01}
            maxValue={2}
            minValue={0}
            defaultValue={localSettings.frequency}
            color="foreground"
            className={styles.slider}
            renderThumb={(props) => <div {...props} className={styles.thumb} />}
          />
          <div className={styles.listRow}>
            <div className={styles.listHeader}>Presence penalty</div>
            <div className={styles.listHeader}>{localSettings.presence}</div>
          </div>
          <Slider
            size="sm"
            value={localSettings.presence}
            onChange={(value) => updateLocalSetting('presence', Number(value))}
            step={0.01}
            maxValue={2}
            minValue={0}
            defaultValue={localSettings.presence}
            color="foreground"
            className={styles.slider}
            renderThumb={(props) => <div {...props} className={styles.thumb} />}
          />
          <div className={styles.listHeader}>Custom Prompt</div>
          <div className={styles.textareaContainer}>
            <textarea
              value={localSettings.customPrompt}
              onChange={(e) => updateLocalSetting('customPrompt', e.target.value)}
              className={styles.textarea}
              placeholder="Write your prompt here..."
            />
          </div>
        </div>
      </ScrollShadow>
      {!isAuthenticated && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalButton} onClick={onOpen}>
            Sign In
          </div>
        </div>
      )}
      <Auth isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default Settings;
