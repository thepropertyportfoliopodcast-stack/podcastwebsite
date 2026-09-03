import { Api } from "./apiClient";

class PodcastApi {
  async Login(data) {
    return Api.post("/user/login", data);
  }

  async profileVerify(signal) {
    return Api.get("/user/profile", { signal })
  }

  async Dashboard() {
    return Api.get(`/user/dashboard`);
  }
  
  async PodcastGet() {
    return Api.get("/podcast/get")
  }

  async EpisodeGetAll(search = "", topic = "", page = 1, limit = 10) {
    return Api.get(`/file/getAll?search=${encodeURIComponent(search)}&topic=${encodeURIComponent(topic)}&page=${page}&limit=${limit}`);
  }

  async HomeEpisode() {
    return Api.get("/home/file/getAll")
  }

  async EpisodeByID(data) {
    return Api.get(`/file/get/${data}`)
  }

  async AdminEpisodeByUUID(data) {
    return Api.get(`/admin/file/get/${data}`)
  }

  async GuideList(page=1) {
    return Api.get(`/guide/getAll?page=${page}`)
  }

  async HomeGuideGet() {
    return Api.get("/home/guide/getAll")
  }

  async AdminPodcastGet() {
    return Api.get("/admin/podcast/get")
  }
  
  async PodcastDetail(data) {
    return Api.get(`/podcast/get/${data}`);
  }

  async AdminPodcastDetail(data) {
    return Api.get(`/admin/podcast/get/${data}`);
  }

  async AdminEpisodeGetAll() { return Api.get("/admin/file/getAll"); }

  async HostGet() { return Api.get("/host/get"); }
  async HostDetail(id) { return Api.get(`/host/get/${id}`); }
  async AdminHostGet() { return Api.get("/admin/host/get"); }
  async HostAdd(data) { return Api.post("/admin/host/add", data); }
  async HostUpdate(id, data) { return Api.post(`/admin/host/update/${id}`, data); }
  async HeroPhoneGet() { return Api.get("/hero-phone/get"); }
  async AdminHeroPhoneGet() { return Api.get("/admin/hero-phone/get"); }
  async HeroPhoneAdd(data) { return Api.post("/admin/hero-phone/add", data); }
  async HeroPhoneUpdate(id, data) { return Api.post(`/admin/hero-phone/update/${id}`, data); }
  async HeroPhoneDelete(id) { return Api.delete(`/admin/hero-phone/delete/${id}`); }
  
  async PodcastAdd(data) {
    return Api.post("/admin/podcast/add", data);
  }

  async PodcastUpdate(id,data) {
    return Api.post(`/admin/podcast/update/${id}`, data);
  }

  async PodcastDelete(id) {
    return Api.delete(`/admin/podcast/delete/${id}`);
  }

  async EpisodeAdd(data) {
    return Api.post("/admin/file/add", data);
  }

  async EpisodeUpdate(id,data) {
    return Api.post(`/admin/file/update/${id}`, data);
  }

  async EpisodeTranscriptRegenerate(id) {
    return Api.post(`/admin/file/${id}/transcript/regenerate`);
  }

  async EpisodeTranscriptsBackfill(force = false) {
    return Api.post("/admin/transcripts/backfill", { force });
  }

  async EpisodeTranscriptsStatus() {
    return Api.get("/admin/transcripts/status");
  }

  async EpisodeTranscriptsList(params = {}) {
    return Api.get("/admin/transcripts", { params });
  }

  async EpisodeTranscriptRetry(id) {
    return Api.post(`/admin/transcripts/${id}/regenerate`);
  }

  async EpisodeTranscriptCancel(id) {
    return Api.post(`/admin/transcripts/${id}/cancel`);
  }

  async EpisodeTranscriptDelete(id) {
    return Api.delete(`/admin/transcripts/${id}`);
  }

  async EpisodeTranscriptsRetryFailed() {
    return Api.post("/admin/transcripts/retry-failed");
  }

  async EpisodeDelete(id) {
    return Api.delete(`/admin/file/delete/${id}`);
  }

  async EpisodePermanentDelete(id) {
    return Api.delete(`/admin/file/delete-permanent/${id}`);
  }

  async GuideAdd(data) {
    return Api.post("/admin/guide/add", data);
  }

  async AdminGuideGet(data) {
    return Api.get("/admin/guide/get", data);
  }

  async AddSubscriber(data){
    return Api.post("/subscriber/add" , data);
  }
async enquiryGet(page, limit) {
    return Api.get(`/contact/get?page=${page}&limit=${limit}`);
  }
  async enquiryDelete(id) {
    return Api.delete(`/contact/delete/${id}`);
  }
  async enquirySheetSync(id) {
    return Api.post(`/contact/sync/${id}`);
  }
  async analyticsGet(params = {}) {
    return Api.get("/admin/analytics", { params });
  }
  async analyticsErrorDelete(id) { return Api.delete(`/admin/analytics/errors/${id}`); }
  async analyticsErrorsClear() { return Api.delete("/admin/analytics/errors"); }
  async analyticsLighthousePages() { return Api.get("/admin/analytics/lighthouse/pages"); }
  async analyticsLighthouse(params = {}) { return Api.get("/admin/analytics/lighthouse", { params }); }
  async analyticsHealth() { return Api.get("/admin/analytics/health"); }
  async analyticsIpExclusionsGet() { return Api.get("/admin/analytics/ip-exclusions"); }
  async analyticsIpExclusionCreate(data) { return Api.post("/admin/analytics/ip-exclusions", data); }
  async analyticsIpExclusionUpdate(id, data) { return Api.patch(`/admin/analytics/ip-exclusions/${id}`, data); }
  async analyticsIpExclusionDelete(id) { return Api.delete(`/admin/analytics/ip-exclusions/${id}`); }
  async AdminUsersGet() { return Api.get("/admin/users"); }
  async AdminUserCreate(data) { return Api.post("/admin/users", data); }
  async AdminUserUpdate(id, data) { return Api.patch(`/admin/users/${id}`, data); }
  async AdminUserDelete(id) { return Api.delete(`/admin/users/${id}`); }
   async GetSubscriber(page, limit){
    return Api.get(`/subscriber/get?page=${page}&limit=${limit}`);
  }
  async AddContact(data){
    return  Api.post("/contact/add",data)
  }
  render() {
    return (
      <div>
        <></>
      </div>
    );
  }
}

export default PodcastApi;
