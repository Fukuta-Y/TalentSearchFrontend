export const API_PORT = 8081;

const SHUKAN_TALENT_JOHO_URL = "http://localhost:{0}/api/shukanTalentJohoBFF?nentsuki={1}&shu={2}&talentName={3}".replace("{0}", API_PORT);
const NENTSUKI_SHUKANRI_ALL_URL = "http://localhost:{0}/api/nentsukiShuKanriBFF".replace("{0}", API_PORT);
const NENTSUKI_SHUKANRI_URL = "http://localhost:{0}/api/nentsukiShuKanriBFF?nentsuki={1}&shu={2}".replace("{0}", API_PORT);
const PROGRAM_SHUTSUEN_URL = "http://localhost:{0}/api/programShutsuenBFF?programId={1}&onAirDay={2}&nentsuki={3}&shu={4}".replace("{0}", API_PORT);
const TALENT_SHUKAN_SHUTSUEN_JOHO_URL = "http://localhost:{0}/api/talentShukanShutsuenJohoBFF?nentsuki={1}&shu={2}&talentId={3}".replace("{0}", API_PORT);

const TALENT_INFO_URL = "http://localhost:{0}/api/talentInfoBFF/{1}".replace("{0}", API_PORT);
const ON_AIR_KANRI_INFO_URL = "http://localhost:{0}/api/onAirKanriInfoBFF".replace("{0}", API_PORT);
const PROGRAM_INFO_URL = "http://localhost:{0}/api/programInfoBFF/{1}".replace("{0}", API_PORT);
const CHANNEL_INFO_URL = "http://localhost:{0}/api/channelInfoBFF".replace("{0}", API_PORT);

const KBN_MASTER_URL = "http://localhost:{0}/api/kbnMasterBFF/{1}".replace("{0}", API_PORT);

const PROGRAM_TOROKU_KOSHIN_URL = "http://localhost:{0}/api/programTorokuKoshinBFF".replace("{0}", API_PORT);
const TALENT_TOROKU_KOSHIN_URL = "http://localhost:{0}/api/talentTorokuKoshinBFF".replace("{0}", API_PORT);

const PROGRAM_REF_URL = "http://localhost:{0}/api/programRefBFF?programId={1}&programName={2}".replace("{0}", API_PORT);
const ON_AIR_KANRI_REF_URL = "http://localhost:{0}/api/onAirKanriRefBFF?id={1}&onAirDay={2}".replace("{0}", API_PORT);
const NENTSUKI_SHU_KANR_REF_URL = "http://localhost:{0}/api/nentsukiShuKanrRefBFF?nentsuki={1}&shu={2}".replace("{0}", API_PORT);
const TALENT_REF_URL = "http://localhost:{0}/api/talentRefBFF?talentId={1}&talentName={2}".replace("{0}", API_PORT);
