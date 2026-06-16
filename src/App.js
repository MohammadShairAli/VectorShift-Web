// import { PipelineToolbar } from './toolbar';
// import { PipelineUI } from './ui';
// import { SubmitButton } from './submit';

// function App() {
//   return (
//     <div className="app-shell">
//       <nav className="top-nav">
//         <span className="top-nav__brand">
//           <img className="top-nav__brand-icon" src="/VectorShift.png" alt="" />
//           <span className="top-nav__brand-text">
//             <span className="top-nav__brand-vector">Vector</span>
//             <span className="top-nav__brand-shift">Shift</span>
//           </span>
//         </span>
//         <SubmitButton />
//       </nav>
//       <PipelineToolbar />
//       <PipelineUI />
//     </div>
//   );
// }

// export default App;
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div className="app-shell">
      <nav className="top-nav">
        <span className="top-nav__brand">
          <img className="top-nav__brand-icon" src="/VectorShift.png" alt="" />
          <span className="top-nav__brand-text">
            <span className="top-nav__brand-vector">Vector</span>
            <span className="top-nav__brand-shift">Shift</span>
          </span>
        </span>
        <SubmitButton />
      </nav>
      <PipelineToolbar />
      <PipelineUI />
    </div>
  );
}

export default App;
