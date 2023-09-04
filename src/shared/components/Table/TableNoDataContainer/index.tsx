import "./style.css";
import { ReactComponent as NoData } from "./../../../../shared/assets/no-data.svg";

const TableNoDataContainer = () => {
    return (
        <div className="card table__no-data-container">
            <div className="table__no-data-container__content">
                <NoData className="table__no-data-container__content__image" />
                <h6 className="table__no-data-container__content__message">
                    No transactions
                </h6>
            </div>
        </div>
    );
};

export default TableNoDataContainer;
