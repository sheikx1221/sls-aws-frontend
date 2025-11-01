import './loader.css';
interface Props {
    color?: string;
    size?: number;
}
export function Loader({ color = 'white', size = 20 }: Props) {
    return <div className="d-flex flex-fill justify-content-center w-100">
        <div style={{
            width: size,
            backgroundColor: color
        }} className='loader'></div>
    </div>
}