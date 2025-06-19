'use clien';

import React from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
};


const Pagination: React.FC<PaginationProps> = ({totalPages, currentPage, handlePageChange}) => {
  return (
    <div className={styles.pagination}>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className={classNames(styles.pagination__page, {
            [styles.pagination__page_active]: currentPage === i + 1,
          })}
          onClick={() => handlePageChange(i + 1)}
          disabled={currentPage === i + 1}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
};

export default Pagination;