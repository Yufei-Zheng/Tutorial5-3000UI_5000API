import React from "react";
import "./waitlist.css"
import logo from "./homepage-img.png"

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

class DisplayHomepage extends React.Component{
   render(){
      return(
      <div>
         <h2>Homepage</h2>
         <img src={logo} className="logoImg"/>
         <br/><br/>
      </div>
      );
   }
}

class IssueRow extends React.Component {
   render() {
       const issue = this.props.issue;
       return (
       <tr>
           <td>{issue.serial}</td>
           <td>{issue.name}</td>
           <td>{issue.contact}</td>
           <td>{issue.time.toDateString()}</td> 
       </tr>
       );
   }
}

class IssueTable extends React.Component {
   render() {
       const issueRows = this.props.issues.map(issue =>
       <IssueRow key={issue.id} issue={issue} />
       );

       return (
       <table className="table">
           <thead>
           <tr>
               <th>Serial No.</th>
               <th>Name</th>
               <th>Phone number</th>
               <th>Timestamp</th>
           </tr>
           </thead>
           <tbody>
           {issueRows}
           </tbody>
       </table>
       );
   }
}

class IssueAdd extends React.Component {
   constructor() {
       super();
       this.handleSubmit = this.handleSubmit.bind(this);
   }

   handleSubmit(e) {
       e.preventDefault();
       const form = document.forms.issueAdd;
       const issue = {name: form.name.value, contact: form.contact.value, id: form.name.value + form.contact.value,time: new Date(),}
       if (form.name.value.length==0){
           alert("Customer inofrmation can not be null!")
       }
       else {
           this.props.createIssue(issue);
           form.name.value = ""; form.contact.value = "";
       }
   }

   render() {
       return (
       <form name="issueAdd" onSubmit={this.handleSubmit}>
           <input type="text" name="name" placeholder="Name" />
           <input type="text" name="contact" placeholder="Contact" />
           <button>Add</button>
       </form>
       );
   }
}

class IssueDelete extends React.Component {
   constructor() {
       super();
       this.handleDelete = this.handleDelete.bind(this);
   }

   handleDelete(e) {
       e.preventDefault();
       const form = document.forms.issueDelete;
       const sno = form.sno.value
       this.props.deleteIssue(sno);
       form.sno.value = "";
   }

   render() {
       return (
       <form name="issueDelete" onSubmit={this.handleDelete}>
           <input type="number" min="1" max="25" name="sno" placeholder="Serial Number" />
           <button>Delete</button>
       </form>
       );
   }
}

class DisplayFreeSlots extends React.Component{
   render(){
      return(
         <div>
            <br/>
            <div>Free slots avaliable on the waitlist: {25-this.props.issues.length}</div>
         </div>
      );
   }
}

async function graphQLFetch(query, variables = {}) {
    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
}

class WaitlistSystem extends React.Component {
   constructor() {
       super();
       this.state = { issues: [], buttonName:'', buttonReserve:false, buttonDelete:false,buttonHomepage:true};
       this.createIssue = this.createIssue.bind(this);
       this.deleteIssue = this.deleteIssue.bind(this);
       this.componentDisplay = this.componentDisplay.bind(this);
   }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        const query = `query {
            issueList {
                id name contact time 
            }
        }`;

        const data = await graphQLFetch(query); 
        if (data) { 
            this.setState({ issues: data.issueList }); 
        }
    }

    async createIssue(issue) {
        if (this.state.issues.length<25){
            const query = `mutation {
                issueAdd(issue:{
                    id: "${issue.id}"
                    name: "${issue.name}",
                    contact: "${issue.contact}",
                    time: "${issue.time}",
                }) {
                  id
                }
              }`;

            const data = await graphQLFetch(query, { issue }); 
            if (data) { 
                this.loadData(); 
            }
        }
        else{
            alert ("Waitlist is already full!")
        }
    }

   async deleteIssue(sno) {
       const newIssueList = this.state.issues.slice();
       const deleteArray = newIssueList[sno-1]
       const deleteID = deleteArray.id

       if (sno>=1 && sno<=this.state.issues.length) {
            const query = `mutation {
                issueDelete(id: "${deleteID}"){
                    msg
                }
            }`;
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ query })
            });

            this.loadData(); 
        }
       else{
           alert ("Not in the waitlist!")
       }
   }

   componentDisplay(buttonName){
      switch (buttonName) {
         case "reserve":
           this.setState({ buttonReserve:true, buttonDelete:false, buttonHomepage:false});
           break;
         case "delete":
           this.setState({ buttonReserve:false, buttonDelete:true, buttonHomepage:false});
           break;
         case "homepage":
           this.setState({ buttonReserve:false, buttonDelete:false, buttonHomepage: true});
           break;
         default:
           null;
       }
   }

   render() {
       const buttonReserve = this.state.buttonReserve
       const buttonDelete = this.state.buttonDelete
       const buttonHomepage = this.state.buttonHomepage
       return (
         <React.Fragment>
           <h1>Hotel California International Reservation</h1>
           <hr/><br/>
           <div>
            <div>
                  <button onClick={() => this.componentDisplay("reserve")} style={{width:"100px", height:"35px"}}> Reserve </button>
                  <button onClick={() => this.componentDisplay("delete")} style={{width:"100px", height:"35px"}}> Delete </button>
                  <button onClick={() => this.componentDisplay("homepage")} style={{width:"100px", height:"35px"}}> Homepage </button>
               </div>
               <div>
                  {buttonHomepage && <DisplayHomepage/>}
                  {buttonHomepage && <DisplayFreeSlots issues={this.state.issues}/>}
                  <br/>
               </div>
               <IssueTable issues={this.state.issues}/>
               <br/>
            <div>
                  {buttonReserve && <IssueAdd createIssue={this.createIssue}/>}
                  <br/>
                  {buttonDelete && <IssueDelete deleteIssue={this.deleteIssue}/>}
                  <br/>
               </div>
            </div>
        </React.Fragment>
       );
   }
}


export default WaitlistSystem;

