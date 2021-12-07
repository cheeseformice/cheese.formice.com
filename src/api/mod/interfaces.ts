import { BasePlayer } from "..";

interface DisqualificationInformation {
  moderator: BasePlayer;
  reason: string;
}
interface SanctionInformationWithoutCFM {
  success: undefined;
  tfm: boolean;
  cfm: false;
}
interface SanctionInformationWithCFM {
  success: undefined;
  tfm: boolean;
  cfm: true;
  disqInfo: DisqualificationInformation;
}
export type SanctionInformation = SanctionInformationWithCFM | SanctionInformationWithoutCFM;
