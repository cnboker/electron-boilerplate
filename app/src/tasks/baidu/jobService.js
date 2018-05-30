import { jobContext } from "./jobContext";
import polishJober from "./polishJober";
import scanJober from "./scanJober";

export default class jobService {
  static async run() {
    polishJober.execute(jobContext);
    scanJober.execute(jobContext);
  }
}
