import React from "react";
import CenterStage from "../../Components/Layout/CenterStage";
import GlassBackground from "../../Components/Layout/GlassBackground";
import { MainMenu } from "../../Components/MainMenu";

const HomePage: React.FC = () => {
  return (
    <CenterStage>
      <div className="page-wrap">
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <img src={"../../assets/logo.svg"} alt="Kvízjáték" height={56} />
        </div>
        <GlassBackground className="menu-surface">
          <MainMenu />
        </GlassBackground>
      </div>
    </CenterStage>
  );
};

export default HomePage;
