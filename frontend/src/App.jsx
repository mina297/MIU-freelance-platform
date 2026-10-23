import { useEffect, useRef, useState } from "react";
import ProjectsCatalogue from "./features/projects/ProjectsCatalogue.jsx";
import ProjectDetails from "./features/projects/ProjectDetails.jsx";

// Temporary preview until Member 1 connects the shared router.
export default function App() {
  const [projectId, setProjectId] = useState(null);
  const returnFocusRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (projectId) {
      document.getElementById("project-details-heading")?.focus();
    } else {
      returnFocusRef.current?.focus();
    }
  }, [projectId]);

  function openProject(id) {
    returnFocusRef.current = document.activeElement;
    setProjectId(id);
  }

  return (
    <>
      <div hidden={Boolean(projectId)}>
        <ProjectsCatalogue onOpenProject={openProject} />
      </div>
      {projectId && (
        <ProjectDetails
          projectId={projectId}
          onBack={() => setProjectId(null)}
        />
      )}
    </>
  );
}
