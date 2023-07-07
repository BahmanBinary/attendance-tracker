const { systemPreferences } = require("electron");

module.exports.askForMediaAccess = async function () {
  try {
    if (process.platform !== "darwin") return;

    const microphoneStatus =
      systemPreferences.getMediaAccessStatus("microphone");

    if (microphoneStatus === "not-determined")
      await systemPreferences.askForMediaAccess("microphone");

    const cameraStatus = systemPreferences.getMediaAccessStatus("camera");

    if (cameraStatus === "not-determined")
      await systemPreferences.askForMediaAccess("camera");
  } catch (error) {
    log.error("Could not get microphone permission:", error.message);
  }
};
