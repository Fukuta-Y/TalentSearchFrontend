export const SERVER_DOMAIN_API = "https://talentsearchbff.onrender.com";
// SERVER_DOMAIN_SCREENは画面のURL定義には不要なので、削除するかコメントアウトしてください。
// export const SERVER_DOMAIN_SCREEN = "talent-search-frontend.onrender.com";

// 以下はAPIのURL (変更なし)
export const SHUKAN_TALENT_JOHO_URL = "{0}/api/shukanTalentJohoBFF?nentsuki={1}&shu={2}&talentName={3}".replace("{0}", SERVER_DOMAIN_API);
export const NENTSUKI_SHUKANRI_URL = "{0}/api/nentsukiShuKanriBFF".replace("{0}", SERVER_DOMAIN_API);
export const NENTSUKI_SHUKANRI_GET_URL = "{0}/api/nentsukiShuKanriBFF?nentsuki={1}&shu={2}".replace("{0}", SERVER_DOMAIN_API);
export const TALENT_SHUKAN_SHUTSUEN_JOHO_URL = "{0}/api/talentShukanShutsuenJohoBFF?nentsuki={1}&shu={2}&talentId={3}".replace("{0}", SERVER_DOMAIN_API);
export const PROGRAM_SHUTSUEN_URL = "{0}/api/programShutsuenBFF?programId={1}&onAirDay={2}&nentsuki={3}&shu={4}".replace("{0}", SERVER_DOMAIN_API);

export const PROGRAM_INFO_URL = "{0}/api/programInfoBFF/{1}".replace("{0}", SERVER_DOMAIN_API);
export const TALENT_INFO_URL = "{0}/api/talentInfoBFF/{1}".replace("{0}", SERVER_DOMAIN_API);
export const ON_AIR_KANRI_INFO_URL = "{0}/api/onAirKanriInfoBFF".replace("{0}", SERVER_DOMAIN_API);
export const CHANNEL_INFO_URL = "{0}/api/channelInfoBFF".replace("{0}", SERVER_DOMAIN_API);

export const KBN_MASTER_URL = "{0}/api/kbnMasterBFF/{1}".replace("{0}", SERVER_DOMAIN_API);
export const PROGRAM_TOROKU_KOSHIN_URL = "{0}/api/programTorokuKoshinBFF".replace("{0}", SERVER_DOMAIN_API);
export const TALENT_TOROKU_KOSHIN_URL = "{0}/api/talentTorokuKoshinBFF".replace("{0}", SERVER_DOMAIN_API);

export const PROGRAM_REF_URL = "{0}/api/programRefBFF?programId={1}&programName={2}".replace("{0}", SERVER_DOMAIN_API);
export const ON_AIR_KANRI_REF_URL = "{0}/api/onAirKanriRefBFF?id={1}&onAirDay={2}".replace("{0}", SERVER_DOMAIN_API);
export const NENTSUKI_SHU_KANRI_REF_URL = "{0}/api/nentsukiShuKanriRefBFF?nentsuki={1}&shu={2}".replace("{0}", SERVER_DOMAIN_API);
export const TALENT_REF_URL = "{0}/api/talentRefBFF?talentId={1}&talentName={2}".replace("{0}", SERVER_DOMAIN_API);


// 以下は画面のURL - ここを修正しました
// 週間タレント出演検索
export const WEEK_TALENT_SHUTSUEN = "/WeekTalentShutsuenBaseForm";
// 番組登録
export const PROGRAM_TOROKU_KOSHIN = "/ProgramTorokuKoshinBaseForm";
// オンエア管理登録
export const TALENT_TOROKUKOSHIN = "/TalentTorokuKoshinBaseForm";
// 年月週管理登録
export const NETSUKI_SHU_KANRI_TOROKU_KOSHIN = "/NetsukiShuKanriTorokuKoshinBaseForm";
// オンエア管理登録
export const ON_AIR_KANRI_TOROKU_KOSHIN = "/OnAirKanriTorokuKoshinBaseForm";
