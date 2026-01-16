class Web3Manager {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.contractAddress = "0xYourTestnetContractAddress"; // UPDATE THIS AFTER DEPLOYMENT
    this.abi = []; // PASTE ABI HERE AFTER COMPILATION
  }
  
  async connectWallet() {
    if (!window.ethereum) {
      alert('❌ MetaMask not detected. Install from metamask.io');
      return false;
    }
    
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.contract = new ethers.Contract(this.contractAddress, this.abi, this.signer);
      
      const address = await this.signer.getAddress();
      document.getElementById('walletStatus').innerHTML = 
        `<span class="connected">${address.slice(0,6)}...${address.slice(-4)} ✓</span>`;
      return true;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      return false;
    }
  }
  
  async submitTask(platformId, taskId, proofHash, rewardToken, expectedReward) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.submitTask(
      platformId,
      ethers.utils.id(taskId),
      ethers.utils.id(proofHash),
      rewardToken,
      ethers.utils.parseEther(expectedReward.toString())
    );
    
    await tx.wait();
    return tx.hash;
  }
}

window.web3Manager = new Web3Manager();
