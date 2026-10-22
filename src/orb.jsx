import React from 'react';
/** Independent fluid fields, optical shell and orbit, inside one fixed layout seat. */
export function LiquidOrb() {
  return <span className="lg-orb-stage" aria-hidden="true">
    <span className="lg-orb-halo"/>
    <span className="lg-orb-orbit"><i/></span>
    <span className="lg-hero-orb"><span className="lg-orb-clip">
      <span className="lg-orb-fluid lg-orb-fluid-a"/>
      <span className="lg-orb-fluid lg-orb-fluid-b"/>
      <span className="lg-orb-fluid lg-orb-fluid-c"/>
      <span className="lg-orb-core"/>
      <span className="lg-orb-ribbon lg-orb-ribbon-a"/>
      <span className="lg-orb-ribbon lg-orb-ribbon-b"/>
      <span className="lg-orb-caustic"/>
      <span className="lg-orb-sheen"/>
    </span></span>
    <span className="lg-orb-shadow"/>
  </span>;
}
