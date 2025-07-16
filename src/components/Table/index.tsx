import React from "react";
import styles from "./styles.module.scss";
import classNames from "classnames";
import Link from "next/link";

interface TableColumn {
  key: string;
  title: string;
  width?: string;
  isLink?: boolean;
  isButton?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any[];
  emptyMessage?: string;
  keyField?: string;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  emptyMessage = "Данных нет",
//   keyField = "id",
}) => {
  return (
    <div className={styles.table}>
      {data && data.length > 0 ? (
        <>
          <div className={styles.table__row}>
            {columns.map((column,index) => (
              <div
                key={index}
                className={classNames(styles.table__cell, styles.table__header)}
                style={{ width: column.width }}
              >
                {column.title}
              </div>
            ))}
          </div>
          {data.map((row, index) => (
            <div key={index} className={styles.table__row}>
              {columns.map((column,index) => (
                <div
                  key={index}
                  className={classNames(styles.table__cell, {
                    [styles["table__cell--link"]]:
                      column.isLink || column.isButton,
                  })}
                  style={{ width: column.width }}
                >
                  {column.render ? (
                    column.render(row[column.key], row)
                  ) : column.isLink ? (
                    <Link href={row[column.key]}>{row[column.key]}</Link>
                  ) : (
                    <span>{row[column.key]}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </>
      ) : (
        <div className={styles.table__empty}>{emptyMessage}</div>
      )}
    </div>
  );
};

export default Table;
