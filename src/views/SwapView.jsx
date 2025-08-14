import React from "react";
import { useContext } from "react";
import Sat2KasSwapForm from "../components/Swap/Sat2KasSwapForm.jsx";
import { GeneralContext } from "../components/ContextProviders/GeneralContextProvider.jsx";
import { SwapType } from "../utils/communication.js";

const SwapView = () => {
  const { swapType } = useContext(GeneralContext);

  return <>{swapType == SwapType.SAT2KAS ? <Sat2KasSwapForm /> : undefined}</>;
};

export default SwapView;
