export class DebugTool {

  public static console(strs) {
    console.log(`%c${strs}`, "color:#409EFF;font-weight:bold;");
  }
}