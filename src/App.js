import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component{
  constructor(props) {
    super(props);
    this.state = { manager: '', players: [], balance: '', value: '', message:''};
  }

  async componentDidMount() {
    // const manager = await lottery.methods.manager().call();
    // const players = await lottery.methods.getPlayers().call();
    // const balance = await web3.eth.getBalance(lottery.options.address);
    // this.setState({ manager: manager, players: players, balance:balance });
    this.fetchInfo();

  }

  async fetchInfo() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager: manager, players: players, balance:balance });
  }

  onSubmit = async (event)=> {
    event.preventDefault(); 
    window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting for transaction to be over...." });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });
    console.log(accounts);
    console.log(this.state.manager );
    this.setState({ message: "You have  entered successfully" });
    this.fetchInfo();
  }

  onClick = async () => {
    window.ethereum.enable();
    const accounts = await web3.eth.getAccounts(); 
    this.setState({ message: "Waiting for transaction to be over...." });
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    this.setState({ message: "A winner has been picked...." });
    this.fetchInfo();
  }
  render() {
    return (
      <div>
        <h2>Lottery  Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>There are currently {this.state.players.length} players taking part in the draw.</p>
        <p> Winner will win {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter: </label>
            <input onChange={event => this.setState({ value: event.target.value })} value={this.state.value}/>
          </div>
          <button>Enter</button>
        </form>
        <hr/>
        <h3 >{this.state.message}</h3>
        <hr />
        <h4>Ready to Pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner</button>
      </div>
    );
  }
}
export default App;
