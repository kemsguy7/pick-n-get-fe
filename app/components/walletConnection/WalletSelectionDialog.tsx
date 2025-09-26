"use client"

import { connectToMetamask } from "../../../app/services/wallets/metamask/metamaskClient";
import { openWalletConnectModal } from "../../../app/services/wallets/walletconnect/walletConnectClient";

import MetamaskLogo from "../../../public/metamask-logo.svg";
import WalletConnectLogo from "../../../public/walletconnect-logo.svg";

interface WalletSelectionDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose: (value: string) => void;
}

export const WalletSelectionDialog = (props: WalletSelectionDialogProps) => {
  const {  open, setOpen } = props;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-sm w-full">
        <h3 className="text-white text-xl font-semibold mb-4 text-center">Connect Wallet</h3>
        <div className="space-y-3">
          <button
            onClick={() => {
              openWalletConnectModal();
              setOpen(false);
            }}
            className="w-full flex items-center justify-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 text-white font-medium"
          >
            <img
              src={WalletConnectLogo}
              alt="walletconnect logo"
              className="w-6 h-6 -ml-1.5"
            />
            WalletConnect
          </button>
          
          <button
            onClick={async () => {
              console.log('MetaMask button clicked');
              try {
                const accounts = await connectToMetamask();
                console.log('Connection result:', accounts);
                
                // Force close dialog on any successful interaction
                // The state update will be handled by the MetaMaskClient
                if (accounts && accounts.length > 0) {
                  // Add small delay to ensure state updates
                  setTimeout(() => {
                    setOpen(false);
                  }, 100);
                }
              } catch (error) {
                console.error('Error connecting to MetaMask:', error);
              }
            }}
            className="w-full flex items-center justify-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 text-white font-medium"
          >
            <img
              src={MetamaskLogo}
              alt="metamask logo"
              className="w-6 h-6 p-1 pr-0"
            />
            Metamask
          </button>
        </div>
        
        <button
          onClick={() => setOpen(false)}
          className="mt-4 w-full py-2 text-white/70 hover:text-white transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
// export const WalletSelectionDialog = (props: WalletSelectionDialogProps) => {
//   const { onClose, open, setOpen } = props;

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-sm w-full">
//         <h3 className="text-white text-xl font-semibold mb-4 text-center">Connect Wallet</h3>
//         <div className="space-y-3">
//           <button
//             onClick={() => {
//               openWalletConnectModal();
//               setOpen(false);
//             }}
//             className="w-full flex items-center justify-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 text-white font-medium"
//           >
//             <Image
//               src={WalletConnectLogo}
//               alt="walletconnect logo"
//               className="w-6 h-6 -ml-1.5"
//             />
//             WalletConnect
//           </button>
          
//           <button
//             onClick={() => {
//               connectToMetamask();
//             }}
//             className="w-full flex items-center justify-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 text-white font-medium"
//           >
//             <Image
//               src={MetamaskLogo}
//               alt="metamask logo"
//               className="w-6 h-6 p-1 pr-0"
//             />
//             Metamask
//           </button>
//         </div>
        
//         <button
//           onClick={() => setOpen(false)}
//           className="mt-4 w-full py-2 text-white/70 hover:text-white transition-colors duration-200"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };