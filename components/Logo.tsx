import React from "react";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={className}>
      <h1 className="uppercase text-5xl font-bold tracking-[1rem]">NEO</h1>
      <h6 className="uppercase text-base font-light tracking-[0.9rem]">
        design
      </h6>
    </div>
  );
};

export default Logo;
