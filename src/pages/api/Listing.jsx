import { Component } from "react";
import { Api, ApiallowFile } from "./Api";

class Listing extends Component {
  async Login(data) {
    return Api.post("/user/login", data);
  }

  async profileVerify() {
    return Api.get("/user/profile")
  }

  async Dashboard() {
    return Api.get(`/user/dashboard`);
  }
  
  async PodcastGet() {
    return Api.get("/podcast/get")
  }

  async EpisodeGetAll(search = "", topic = "", page = 1, limit = 10) {
    return Api.get(`/file/getAll?search=${search}&topic=${topic}&page=${page}&limit=${limit}`);
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

  async EpisodeDelete(id) {
    return Api.delete(`/admin/file/delete/${id}`);
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
    return Api.get(`contact/get?page=${page}&limit=${limit}`);
  }
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

export default Listing;