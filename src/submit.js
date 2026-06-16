import { useStore } from './store';

export const SubmitButton = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) {
                throw new Error('Unable to parse pipeline');
            }

            const result = await response.json();
            alert(
                `Pipeline summary:\n` +
                `Nodes: ${result.num_nodes}\n` +
                `Edges: ${result.num_edges}\n` +
                `Is DAG: ${result.is_dag ? 'Yes' : 'No'}`
            );
        } catch (error) {
            alert('Could not submit pipeline. Make sure the backend is running on port 8000.');
        }
    };

    return (
        <div className="submit-bar">
            <button className="submit-button" type="button" onClick={handleSubmit}>
                Submit
            </button>
        </div>
    );
}
