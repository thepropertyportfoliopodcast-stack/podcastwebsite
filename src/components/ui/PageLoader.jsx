import React from "react";

const Loader = () => {
  return (
    <>
      <div className="loader-wrapper my-20">
        <ul className="wave-menu">
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
        </ul>
      </div>

      {/* Inline CSS */}
      <style>{`
        .loader-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .wave-menu {
          border: 4px solid #fff;
          border-radius: 50px;
          width: 200px;
          height: 45px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          margin: 0;
          cursor: pointer;
          transition: ease 0.2s;
          position: relative;
          background: linear-gradient(90deg, #9747FF 0%, #FC18D8 100%);
        }

        .wave-menu li {
          list-style: none;
          height: 30px;
          width: 4px;
          border-radius: 10px;
          background: #fff;
          margin: 0 6px;
          padding: 0;
          animation-name: wave1;
          animation-duration: 0.3s;
          animation-iteration-count: infinite;
          animation-direction: alternate;
          transition: ease 0.2s;
        }

        .wave-menu:hover > li {
          background: linear-gradient(115deg, #9747FF, #FC18D8);
        }

        .wave-menu:hover {
          background: #ffff;
        }

        .wave-menu li:nth-child(2) {
          animation-name: wave2;
          animation-delay: 0.2s;
        }

        .wave-menu li:nth-child(3) {
          animation-name: wave3;
          animation-delay: 0.23s;
          animation-duration: 0.4s;
        }

        .wave-menu li:nth-child(4) {
          animation-name: wave4;
          animation-delay: 0.1s;
          animation-duration: 0.3s;
        }

        .wave-menu li:nth-child(5) {
          animation-delay: 0.5s;
        }

        .wave-menu li:nth-child(6) {
          animation-name: wave2;
          animation-duration: 0.5s;
        }

        .wave-menu li:nth-child(8) {
          animation-name: wave4;
          animation-delay: 0.4s;
          animation-duration: 0.25s;
        }

        .wave-menu li:nth-child(9) {
          animation-name: wave3;
          animation-delay: 0.15s;
        }

        @keyframes wave1 {
          from { transform: scaleY(1); }
          to { transform: scaleY(0.5); }
        }

        @keyframes wave2 {
          from { transform: scaleY(0.3); }
          to { transform: scaleY(0.6); }
        }

        @keyframes wave3 {
          from { transform: scaleY(0.6); }
          to { transform: scaleY(0.8); }
        }

        @keyframes wave4 {
          from { transform: scaleY(0.2); }
          to { transform: scaleY(0.5); }
        }
      `}</style>
    </>
  );
};

export default Loader;