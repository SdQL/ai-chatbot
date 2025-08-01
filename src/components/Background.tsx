import React from "react";
import ContainerChat from "./ContainerChat";

const Background: React.FC = () => (
    <div className="relative flex-1 min-h-screen flex items-center justify-center p-2 lg:p-4 lg:ml-0">
        <div className="w-full max-w-6xl">
            <ContainerChat />
        </div>
    </div>
);

export default Background;