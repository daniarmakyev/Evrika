"use client";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/store/store";
import {
  getPaymentRequisites,
  createPaymentRequisite,
  updatePaymentRequisite,
} from "src/store/finance/finance.action";
import Footer from "@components/Footer";
import Header from "@components/Header";
import HeroBanner from "@components/HeroBanner";
import styles from "./styles.module.scss";
import classNames from "classnames";
import Image from "next/image";
import LoadingSpinner from "@components/Ui/LoadingSpinner";
import InputField from "@components/Fields/InputField";

const coursesPageBanner = {
  title: "Оплата",
  description: "Панель для изменения способа оплаты",
  image: {
    url: "assets/images/finance-banner.svg",
    name: "finance-banner.svg",
  },
};

const FinanceAdminPage = () => {
  const dispatch = useAppDispatch();
  const {
    paymentRequisites,
    paymentRequisitesLoading,
    paymentRequisitesError,
    updateRequisiteLoading,
  } = useAppSelector((state) => state.finance);

  const [paymentType, setPaymentType] = useState<"offline" | "online">(
    "offline"
  );

  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editBankValue, setEditBankValue] = useState("");
  const [editAccountValue, setEditAccountValue] = useState("");
  const [isUploadingQr, setIsUploadingQr] = useState(false);

  useEffect(() => {
    dispatch(getPaymentRequisites());
  }, [dispatch]);

  const currentRequisite = paymentRequisites?.[0];

  const handlePaymentTypeChange = (type: "offline" | "online") => {
    setPaymentType(type);
  };

  const handleCopyAccount = (account: string) => {
    navigator.clipboard.writeText(account);
    alert("Лицевой счет скопирован!");
  };

  const startEditingBank = () => {
    setEditBankValue(currentRequisite?.bank_name || "");
    setIsEditingBank(true);
  };

  const startEditingAccount = () => {
    setEditAccountValue(currentRequisite?.account || "");
    setIsEditingAccount(true);
  };

  const saveBankEdit = async () => {
    if (!editBankValue.trim()) {
      alert("Название банка не может быть пустым");
      return;
    }

    try {
      if (currentRequisite) {
        await dispatch(
          updatePaymentRequisite({
            requisite_id: currentRequisite.id,
            bank_name: editBankValue,
          })
        ).unwrap();

        await dispatch(getPaymentRequisites()).unwrap();
      } else {
        alert("Сначала добавьте лицевой счет и QR код");
        return;
      }

      setIsEditingBank(false);
    } catch (error) {
      alert(`Ошибка сохранения: ${error}`);
    }
  };

  const saveAccountEdit = async () => {
    if (!editAccountValue.trim()) {
      alert("Лицевой счет не может быть пустым");
      return;
    }

    try {
      if (currentRequisite) {
        await dispatch(
          updatePaymentRequisite({
            requisite_id: currentRequisite.id,
            account: editAccountValue,
          })
        ).unwrap();

        await dispatch(getPaymentRequisites()).unwrap();
      } else {
        alert("Сначала добавьте название банка и QR код");
        return;
      }

      setIsEditingAccount(false);
    } catch (error) {
      alert(`Ошибка сохранения: ${error}`);
    }
  };

  const cancelBankEdit = () => {
    setIsEditingBank(false);
    setEditBankValue("");
  };

  const cancelAccountEdit = () => {
    setIsEditingAccount(false);
    setEditAccountValue("");
  };

  const handleQrFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Размер файла не должен превышать 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Можно загружать только изображения");
      return;
    }

    setIsUploadingQr(true);

    try {
      if (currentRequisite) {
        await dispatch(
          updatePaymentRequisite({
            requisite_id: currentRequisite.id,
            qr: file,
          })
        ).unwrap();
      } else {
        const bankName = editBankValue || "Банк";
        const account = editAccountValue || "Не указан";

        await dispatch(
          createPaymentRequisite({
            bank_name: bankName,
            account: account,
            qr: file,
          })
        ).unwrap();
      }

      await dispatch(getPaymentRequisites()).unwrap();
    } catch (error) {
      alert(`Ошибка загрузки QR: ${error}`);
    } finally {
      setIsUploadingQr(false);
    }
  };

  const renderOfflinePayment = () => {
    if (paymentRequisitesLoading) {
      return (
        <div className={styles.finance__pay}>
          <LoadingSpinner />
          <p>Загружаем реквизиты...</p>
        </div>
      );
    }

    return (
      <div className={styles.finance__pay}>
        <div className={styles.finance__instructions}>
          <h3 className={styles.instructions__title}>
            Для проведения оплаты используйте наш лицевой счет или QR-код:
          </h3>

          <ul className={styles.instructions__list}>
            <li>
              Скопируйте или сохраните наш лицевой счёт оплаты, указанный ниже.
            </li>
            <li>
              Наш лицевой счёт:{" "}
              <span className={styles.account}>
                {isEditingAccount ? (
                  <div className={styles.finance__editContainer}>
                    <input
                      type="text"
                      value={editAccountValue}
                      onChange={(e) => setEditAccountValue(e.target.value)}
                      className={styles.finance__editInput}
                      placeholder="Введите лицевой счет"
                    />
                    <button
                      onClick={saveAccountEdit}
                      disabled={updateRequisiteLoading}
                      className={classNames(
                        styles.finance__editButton,
                        styles["finance__editButton--save"]
                      )}
                    >
                      {updateRequisiteLoading ? "..." : "✓"}
                    </button>
                    <button
                      onClick={cancelAccountEdit}
                      className={classNames(
                        styles.finance__editButton,
                        styles["finance__editButton--cancel"]
                      )}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={startEditingAccount}
                    className={styles.finance__editableField}
                    title="Нажмите для редактирования"
                  >
                    {currentRequisite?.account ||
                      "Нажмите для добавления счета"}
                  </span>
                )}
              </span>
              <br />
              <span>
                Банк:{" "}
                {isEditingBank ? (
                  <div className={styles.finance__editContainer}>
                    <InputField
                      type="text"
                      value={editBankValue}
                      onChange={(e) => setEditBankValue(e.target.value)}
                      placeholder="Введите название банка"
                    />
                    <button
                      onClick={saveBankEdit}
                      disabled={updateRequisiteLoading}
                      className={classNames(
                        styles.finance__editButton,
                        styles["finance__editButton--save"]
                      )}
                    >
                      {updateRequisiteLoading ? "..." : "✓"}
                    </button>
                    <button
                      onClick={cancelBankEdit}
                      className={classNames(
                        styles.finance__editButton,
                        styles["finance__editButton--cancel"]
                      )}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={startEditingBank}
                    className={styles.finance__editableField}
                    title="Нажмите для редактирования"
                  >
                    {currentRequisite?.bank_name ||
                      "Нажмите для добавления банка"}
                  </span>
                )}
              </span>
              <br />
              <span className={styles.note}>
                (Вы можете{" "}
                <button
                  type="button"
                  onClick={() =>
                    handleCopyAccount(currentRequisite?.account || "")
                  }
                  className={styles.finance__copyButton}
                  disabled={!currentRequisite?.account}
                >
                  скопировать
                </button>{" "}
                его, сделать скриншот или оплатить напрямую через QR-код)
              </span>
            </li>
            <li>
              Оплатите одним из способов:
              <ol>
                <li>Через мобильное банковское приложение</li>
                <li>Через пост-терминал в любом удобном месте</li>
                <li>
                  Сканировав QR-код через мобильное банковское приложение{" "}
                  <span style={{ fontStyle: "italic", color: "#555" }}>
                    (работает только с местными банками и если QR-код доступен)
                  </span>
                </li>
              </ol>
              После оплаты сфотографируйте чек (если он есть), перейдите в
              профиль, откройте вкладку <strong>&quot;Чеки&quot;</strong>,
              загрузите фото и ожидайте подтверждения от администратора.
            </li>
          </ul>
        </div>
        <div className={styles.finance__qr}>
          <div
            className={classNames(
              styles.finance__qrContainer,
              currentRequisite?.qr
                ? styles["finance__qrContainer--filled"]
                : styles["finance__qrContainer--empty"]
            )}
            onClick={() => document.getElementById("qr-upload")?.click()}
          >
            {isUploadingQr ? (
              <LoadingSpinner />
            ) : currentRequisite?.qr ? (
              <>
                <Image
                  src={currentRequisite.qr}
                  width={400}
                  height={400}
                  alt="QR код для оплаты"
                  style={{ borderRadius: "8px" }}
                />
                <div className={styles.finance__qrOverlay}>
                  Нажмите для изменения QR кода
                </div>
              </>
            ) : (
              <div className={styles.finance__qrPlaceholder}>
                <div className={styles.finance__qrPlaceholderIcon}>📱</div>
                <div>Нажмите для загрузки QR кода</div>
              </div>
            )}
          </div>

          <InputField
            id="qr-upload"
            type="file"
            accept="image/*"
            onChange={handleQrFileChange}
            className={styles.finance__hiddenInput}
          />
        </div>
      </div>
    );
  };

  const renderOnlinePayment = () => (
    <div className={styles.finance__onlinePayment}>
      <p>Онлайн оплата - в разработке</p>
    </div>
  );

  return (
    <>
      <Header />
      <main className="App">
        <HeroBanner data={coursesPageBanner} button={false} />
        <div className={styles.finance}>
          <div className={classNames("container", styles.finance__container)}>
            <div className={styles.finance__content}>
              <h2 className={styles.finance__title}>
                Редактирование способа оплаты
              </h2>
              <p className={styles.finance__description}>
                Нажимайте на элементы ниже для их редактирования
              </p>

              <div className={styles.paymentSwitcher}>
                <button
                  className={classNames(styles.paymentSwitcher__button, {
                    [styles.paymentSwitcher__button_active]:
                      paymentType === "offline",
                  })}
                  onClick={() => handlePaymentTypeChange("offline")}
                >
                  По лицевому счету и QR-коду
                </button>
                <button
                  className={classNames(styles.paymentSwitcher__button, {
                    [styles.paymentSwitcher__button_active]:
                      paymentType === "online",
                  })}
                  onClick={() => handlePaymentTypeChange("online")}
                >
                  Оплата visa/mastercard
                </button>
              </div>

              {paymentType === "offline"
                ? renderOfflinePayment()
                : renderOnlinePayment()}

              {paymentRequisitesError && (
                <div className={styles.finance__error}>
                  Ошибка загрузки реквизитов
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FinanceAdminPage;
