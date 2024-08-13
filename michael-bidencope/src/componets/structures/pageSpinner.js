import './../../App.css';

function PageSpinner() {
        
    return (
        <div className="page-spinner">
            
            <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                <circle class="spinner" cx="400" cy="400" fill="none"
                    r="200" stroke-width="50" stroke="#BBC8D9"
                    stroke-dasharray="700 1400"
                    stroke-linecap="round" />
            </svg>
        </div>
    );
}

export { PageSpinner };