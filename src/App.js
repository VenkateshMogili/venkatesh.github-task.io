import React, {Component} from 'react';
import './App.css';

class App extends Component {
  state = {
    profile:'',
    fullname:'',
    profile_name:'',
    bio:'',
    company:'',
    location:'',
    repos: [],
    languages:[],
    type:["All","Sources","Forks","Archived","Mirrors"],
    search:'',
    searchType:'',
    searchLanguage:''
  };
  componentDidMount(){
    this.getProfile();
    this.getRepos();
  }
  /*Getting profile data*/
  getProfile(){
    fetch('https://api.github.com/users/supreetsingh247')
      .then(response => response.json())
      .then(response => this.setState({
        profile: response.avatar_url,
        fullname: response.name,
        profile_name: response.login,
        bio: response.bio,
        company: response.company,
        location: response.location}))
      .catch(err=>console.error(err))
  }
  /*Getting Repositories data and filtering languages*/
  getRepos(){
    fetch('https://api.github.com/users/supreetsingh247/repos')
      .then(response => response.json())
      .then(response => this.setState({repos: response}))
      .then(res=>
        this.setState({languages: this.state.repos.map(item=>item.language).filter((item,idx,arr)=> arr.indexOf(item)==idx && arr.indexOf(item)!="")})
        )
      .catch(err=>console.error(err))
  }

  /*Searching function for all the type of searches*/
  searchRepo(event){
    /*If type array contains type string*/
    if(this.state.type.includes(event.target.value))
    {
    this.setState({searchType: event.target.value.substr(0,20)});
    }
    /*If languages array contains language string*/
    else if(this.state.languages.includes(event.target.value))
    {
    this.setState({searchLanguage: event.target.value.substr(0,20)});
    }
    /*If data contains project name*/
    else{
      this.setState({search: event.target.value.substr(0,20)});
    }
  }

  /*To clear the search*/
  clearSearch(event){
    this.setState({search:"",searchType:"",searchLanguage:""});
  }
  

  render(){
    const {profile, fullname, profile_name,bio, company, location} = this.state;

    /*Normal Search filtering using project name*/
    let filteredRepos = this.state.repos.filter(
      (item)=>{
        return item.name.indexOf(this.state.search)!==-1;
      });
    /*Search filtering using Type and Language along with project name*/
    let filteredReposType = this.state.repos.filter(
      (item)=>{
        /*If Language is selected*/
        if(this.state.searchLanguage.length>0){
          if(this.state.searchType==="All" && item.name.indexOf(this.state.search)!==-1 && item.language===this.state.searchLanguage) {
            return filteredRepos;
          }
          if(this.state.searchType==="Forks" && item.name.indexOf(this.state.search)!==-1 && item.language===this.state.searchLanguage){
            return item.fork===true;
          }
          if(this.state.searchType==="Sources" && item.name.indexOf(this.state.search)!==-1 && item.language===this.state.searchLanguage){
            return item.has_issues===true;
          }
          if(this.state.searchType==="Archived" && item.name.indexOf(this.state.search)!==-1 && item.language===this.state.searchLanguage){
            return item.archived===true;
          }
          if(this.state.searchType==="Mirrors" && item.name.indexOf(this.state.search)!==-1 && item.language===this.state.searchLanguage){
            return item.mirror_url!==null;
          }
          if(item.name.indexOf(this.state.search)!==-1 && item.language===this.state.searchLanguage) {
            return filteredRepos;
          }
        } else{ /*Except language remaining selected*/
          console.log("Type");
          if(this.state.searchType==="Forks" && item.name.indexOf(this.state.search)!==-1){
            return item.fork===true;
          }
          if(this.state.searchType==="All" && item.name.indexOf(this.state.search)!==-1){
            return filteredRepos;
          }
          if(this.state.searchType==="Sources" && item.name.indexOf(this.state.search)!==-1){
            return item.has_issues===true;
          }
          if(this.state.searchType==="Archived" && item.name.indexOf(this.state.search)!==-1){
            return item.archived===true;
          }
          if(this.state.searchType==="Mirrors" && item.name.indexOf(this.state.search)!==-1){
            return item.mirror_url!==null;
          }
        }
      });

  return (
    <div className="App">
      <div className="leftPanel">
        <img src={profile} className="profile-pic"/>
        <br/>
        <h1 className="fullname">{fullname}<br/>
          <span className="profile-name">{profile_name}</span>
        </h1>
        <small className="bio">{bio}</small>
        <br/><br/>
        <button className="edit-btn">Edit bio</button>
        <br/>
        <small className="company">{company}</small><br/>
        <small className="location">{location}</small><br/>
        <small className="email"><a href="mailto:supreetsingh.247@gmail.com">supreetsingh.247@gmail.com</a></small>
      </div>

      <div className="rightPanel">
        <ul className="tabs">
          <li><a href="#">Overview</a></li>
          <li><a href="#" className="active">Repositories
          <span className="reposCount">{this.state.repos.length}</span></a></li>
          <li><a href="#">Stars</a></li>
          <li><a href="#">Followers</a></li>
          <li><a href="#">Following</a></li>
        </ul>
        <div className="searchPanel">
        <input type="text" 
          value={this.state.search}
          onChange={this.searchRepo.bind(this)}
          placeholder="Find a repository..." 
          className="search-input"/>
        <select className="search-type"
          value={this.state.searchType}
          onChange={this.searchRepo.bind(this)}>
          <option hidden>Type: All</option>
          {this.state.type.map(item=>(
          <option value={item}>{item}</option>
          ))}
        </select>
        <select className="search-language"
          value={this.state.searchLanguage}
          onChange={this.searchRepo.bind(this)}>
          <option hidden>Language: All</option>
          {this.state.languages.map(item=>(
          <option value={item}>{item}</option>
          ))}
        </select>
        <button className="newbtn">New</button>
      </div>

      <div className="resultPanel">
      {/*Only for search input*/}
      {this.state.search.length>0 && !this.state.searchType.length>0 && !this.state.searchLanguage.length>0 && 
        <li className="searchResults"><b>{filteredRepos.length}</b> results for repositories matching <b> {this.state.search} </b>
        <button className="clearFilter" onClick={this.clearSearch.bind(this)}>X Clear Filter</button> </li>
        }
      {/*Only for searchtype*/}
      {!this.state.search.length>0 && this.state.searchType.length>0 && !this.state.searchLanguage.length>0 && 
        <li className="searchResults"><b>{filteredReposType.length}</b> results for <b> {this.state.searchType} </b> repositories
        <button className="clearFilter" onClick={this.clearSearch.bind(this)}>X Clear Filter</button></li>
        }
      {/*Only for searchLanguage*/}
      {!this.state.search.length>0 && !this.state.searchType.length>0 && this.state.searchLanguage.length>0 && 
        <li className="searchResults"><b>{filteredReposType.length}</b> results for repositories written in <b> {this.state.searchLanguage} </b>
        <button className="clearFilter" onClick={this.clearSearch.bind(this)}>X Clear Filter</button></li>
        }
      {/*Only for search input and searchtype*/}
      {this.state.search.length>0 && this.state.searchType.length>0 && !this.state.searchLanguage.length>0 && 
        <li className="searchResults"><b>{filteredReposType.length}</b> results for repositories matching <b> {this.state.search} </b>
        <button className="clearFilter" onClick={this.clearSearch.bind(this)}>X Clear Filter</button></li>
        }
      {/*Only for search input and searchLanguage*/}
      {this.state.search.length>0 && !this.state.searchType.length>0 && this.state.searchLanguage.length>0 && 
        <li className="searchResults"><b>{filteredReposType.length}</b> results for repositories matching <b> {this.state.search} </b> 
        written in <b>{this.state.searchLanguage}</b>
        <button className="clearFilter" onClick={this.clearSearch.bind(this)}>X Clear Filter</button></li>
        }
      {/*Only for searchtype and searchLanguage*/}
      {!this.state.search.length>0 && this.state.searchType.length>0 && this.state.searchLanguage.length>0 && 
        <li className="searchResults"><b>{filteredReposType.length}</b> results for  <b> {this.state.searchType}  </b> repositories
        written in <b> {this.state.searchLanguage} </b>
        <button className="clearFilter" onClick={this.clearSearch.bind(this)}>X Clear Filter</button></li>
        }
      {/*Full Search*/}
      {this.state.search.length>0 && this.state.searchType.length>0 && this.state.searchLanguage.length>0 && 
        <li className="searchResults"><b>{filteredReposType.length}</b> results for <b> {this.state.searchType} </b> repositories matching
        <b> {this.state.search} </b> written in 
        <b> {this.state.searchLanguage} </b>
        <button className="clearFilter" onClick={this.clearSearch.bind(this)}>X Clear Filter</button></li>
        }        

        {/*Search Results with search type and language*/}
        {this.state.searchType.length>0 && this.state.searchLanguage.length>0 && filteredReposType.map(item=>(
          <li className="search-list" key={item.id}>
          <p><a href={item.html_url} target="_blank">{item.name}</a></p>
          <small className="repos-lang">{item.language}</small>
          <small>Updated on {new Intl.DateTimeFormat('en-GB', { 
                month: 'short', 
                day: '2-digit',
                year: 'numeric', 
            }).format(new Date(item.updated_at))}</small>
          </li>
          ))}

        {/*Search Results with only search type*/}
        {this.state.searchType.length>0 && !this.state.searchLanguage.length>0 && filteredReposType.map(item=>(
          <li className="search-list" key={item.id}>
          <p><a href={item.html_url} target="_blank">{item.name}</a></p>
          <small className="repos-lang">{item.language}</small>
          <small>Updated on {new Intl.DateTimeFormat('en-GB', { 
                month: 'short', 
                day: '2-digit',
                year: 'numeric', 
            }).format(new Date(item.updated_at))}</small>
          </li>
          ))}

        {/*Search Results with only search language*/}
        {!this.state.searchType.length>0 && this.state.searchLanguage.length>0 && filteredReposType.map(item=>(
          <li className="search-list" key={item.id}>
          <p><a href={item.html_url} target="_blank">{item.name}</a></p>
          <small className="repos-lang">{item.language}</small>
          <small>Updated on {new Intl.DateTimeFormat('en-GB', { 
                month: 'short', 
                day: '2-digit',
                year: 'numeric', 
            }).format(new Date(item.updated_at))}</small>
          </li>
          ))}

        {/*Search Results with only search input*/}
        {!this.state.searchType.length>0 && !this.state.searchLanguage.length>0 && filteredRepos.map(item=>(
          <li className="search-list" key={item.id}>
          <p><a href={item.html_url} target="_blank">{item.name}</a></p>
          <small className="repos-lang">{item.language}</small>
          <small>Updated on {new Intl.DateTimeFormat('en-GB', { 
                month: 'short', 
                day: '2-digit',
                year: 'numeric', 
            }).format(new Date(item.updated_at))}</small>
          </li>
          ))}
      </div>
      </div>
  </div>
  );
  }
}

export default App;
