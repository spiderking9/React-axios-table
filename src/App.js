import React, { Component } from "react";
import axios from 'axios';
import './App.css';
import Table from './tabel.js';

const API = 'https://recruitment.hal.skygate.io/companies';
const API2 = 'https://recruitment.hal.skygate.io/incomes/';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hits:[],
      isLoading: false,
      error: null
    };
  }


  fetch() {
    this.setState({ isLoading: true });
    axios.get(API)
      .then(result => {
        result.data.map(x => {
          axios.get(API2 + x.id)
            .then(result2 => {
              this.setState({
                hits: this.state.hits.concat({
                  "Id": x.id,
                  "Name": x.name,
                  "City": x.city,
                  "Income": Math.round(result2.data.incomes.reduce((a, b) => a + parseFloat(b.value), 0) * 100) / 100,
                  "Average": Math.round((result2.data.incomes.reduce((a, b) => a + parseFloat(b.value), 0) / 50) * 100) / 100,
                  "lastMonth": Math.round(result2.data.incomes.map((id) => parseFloat(id.date.substring(5, 7)) === parseFloat(new Date().getMonth() + 1) ? id.value : 0).reduce((a, b) => a + parseFloat(b), 0) * 100) / 100
                }),
                isLoading: false
              })
            });
        });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  componentDidMount() {
    this.fetch();
  }


  render() {
    const { hits, isLoading, error} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    } 
    if (isLoading) {
      return <p>Loading ...</p>;
    }
    return (
      <div className='wrapper'>
        <Table hits={hits}
        />
      </div>
    );
  }
}


export default App;
