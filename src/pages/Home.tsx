import { useEffect, useState } from 'react';
import ContractService from '../contracts/ContractService';

const Home: React.FC = () => {
  const [publicKeys, setPublicKeys] = useState<any[]>([]);
  let buyerPubKey;
  let sellerPubKey;
  let deletePubKey;

  const [contractAddress, setContractAddress] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const keys = await ContractService.getPublicKeys(); // Directly await here
        setPublicKeys(keys);
      } catch (error) {
        console.error(`getPublicKeys - ${error}`);
      }
    })(); // Immediately invoke the async function
  }, []);

  if (publicKeys.length > 0) {
    const { buyer, seller, deleted } = publicKeys[0];

    buyerPubKey = buyer;
    sellerPubKey = seller;
    deletePubKey = deleted;
  }

  const deployContract = async () => {
    try {
      const address = await ContractService.createContract();
      await ContractService.sendTxnState(buyerPubKey, sellerPubKey, deletePubKey);
      console.log('address', address);
    } catch (error) {
      console.error(`deployContract - ${error}`);
    }
  };

  const cancelPayment = async () => {
    try {
      await ContractService.createTxnId();
      await ContractService.cancelPaymentInput();
      await ContractService.cancelPaymentOutput();
      await ContractService.inputTxnState(2, 0);
      await ContractService.inputTxnState(3, 0);
      // await ContractService.sign(buyerPubKey);
      // await ContractService.post();
    } catch (error) {
      console.error(`cancelPayment - ${error}`);
    }
  };
  const emptyContract = async () => {
    try {
      await ContractService.createTxnId();
      await ContractService.cancelPaymentInput();
      await ContractService.cancelPaymentOutput();
      await ContractService.inputTxnState(2, 0);
      await ContractService.inputTxnState(3, 0);
      // await ContractService.sign(buyerPubKey);
      // await ContractService.post();
    } catch (error) {
      console.error(`emptyContract - ${error}`);
    }
  };

  const signTxn = async () => {
    try {
      await ContractService.sign(buyerPubKey);
    } catch (error) {
      console.error(`signTxn - ${JSON.stringify(error)}`);
    }
  };

  const signDelete = async () => {
    try {
      await ContractService.signDelete(deletePubKey);
    } catch (error) {
      console.error(`signDelete - ${error}`);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-semibold mb-6">Welcome to Pier2Pier</h1>
          <p className="text-xl mb-8">
            Connecting logistics and supply chain with blockchain technology for seamless, secure,
            and transparent operations.
          </p>
          <button
            onClick={() => emptyContract()}
            className="mb-2 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
          >
            Empty Contract
          </button>
          <button
            onClick={() => signDelete()}
            className="mb-6 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
          >
            Sign Delete
          </button>

          <button
            onClick={() => deployContract()}
            className="mb-2 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
          >
            Create contract
          </button>

          <button
            onClick={() => cancelPayment()}
            className="mb-2 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
          >
            Cancel
          </button>

          <button
            onClick={() => signTxn()}
            className="mb-2 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
          >
            Sign
          </button>

          <button
            // href="#getstarted"
            // onClick={() => createContract()}
            // onClick={() => sendTxnState()}
            onClick={() => cancelPayment()}
            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-12">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">Blockchain Security</h3>
              <p className="text-gray-600">
                All transactions are secured with blockchain technology, ensuring transparency and
                trust.
              </p>
            </div>
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">Seamless Integration</h3>
              <p className="text-gray-600">
                Easily integrates with your existing logistics and supply chain systems for smooth
                operations.
              </p>
            </div>
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">Real-Time Tracking</h3>
              <p className="text-gray-600">
                Track shipments in real-time with our intuitive and user-friendly interface.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* About Section */}
      <section id="about" className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">About Pier2Pier</h2>
          <p className="text-xl text-gray-700 mb-6">
            Pier2Pier is revolutionizing the logistics and supply chain industry by using blockchain
            technology. We provide a seamless and secure way to manage supply chain processes,
            improving transparency, efficiency, and trust.
          </p>
          <a
            href="#getstarted"
            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
          >
            Learn More
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
// // state 1:buuyer address
// // state 2:seller address
// send address:0xDEA10AC04ABA77D183B356645733F043C18CCFDAC887FA56841721F61250AD40 amount:0.005 state:{"0":"0","1":"0x83887AB68A2817F37112DB22DC588D49A09A70282BDDF2092D15040B0015FE28","2":"0xD534CD75384ABBA8E6CEA842D791679D4DDC2206CFC15DCD43D0C2D7EF389BA2"}

// // address1: seller
// // address2: contract
// // publickkey: buyer public key
// txncreate id:stage1
// txninput id:stage1 coinid:[0xAF58489D1D0FDBF52A319BAECCADC5F0A97200EF4554447AB2B1454EA71FA21A]
// txnoutput id:stage1 address:0xD534CD75384ABBA8E6CEA842D791679D4DDC2206CFC15DCD43D0C2D7EF389BA2 amount:0.0025
// txnoutput id:stage1 address:0xDEA10AC04ABA77D183B356645733F043C18CCFDAC887FA56841721F61250AD40 amount:0.0025 tokenid:0x00 storestate:true
// txnsign id:stage1 publickey:[0x07B4BAA83FC107257CEF66D59B6E5234C83CF3799B2939730360DB7D9314F5FF]
// txnpost id:stage1
