import ProfileModal from "@components/ProfileModal";
import TextArea from "@components/Fields/TextAreaField";
import InputField from "@components/Fields/InputField";
import DragAndDrop from "@components/DragAndDrop";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { LessonListItem } from "src/consts/types";
import { clearSubmissionError } from "src/store/lesson/lesson.slice";
import { createHomeworkAssignment } from "src/store/lesson/lesson.action";
import { useAppDispatch, useAppSelector } from "src/store/store";
import styles from "./styles.module.scss";
import SelectField from "@components/Fields/SelectField";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  lessons: LessonListItem[];
  onSuccess?: () => void;
};

interface CreateHomeworkForm {
  title: string;
  description: string;
  deadline: string;
  lessonId: string;
  file: FileList | undefined;
}

const HomeworkCreateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  lessons,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { submissionLoading, submissionError } = useAppSelector(
    (state) => state.lesson
  );
  const [dragKey, setDragKey] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<CreateHomeworkForm>({
    defaultValues: {
      title: "",
      description: "",
      deadline: "",
      lessonId: "",
      file: undefined,
    },
  });

  const fileInput = watch("file");

  useEffect(() => {
    if (isOpen) {
      reset({
        title: "",
        description: "",
        deadline: "",
        lessonId: "",
        file: undefined,
      });
      dispatch(clearSubmissionError());
      setDragKey((k) => k + 1);
    }
  }, [isOpen, reset, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearSubmissionError());
    };
  }, [dispatch]);

  const handleClose = () => {
    dispatch(clearSubmissionError());
    onClose();
  };

  const onSubmit = async (formData: CreateHomeworkForm) => {
    try {
      const fileToUpload =
        formData.file && formData.file[0] ? formData.file[0] : undefined;

      await dispatch(
        createHomeworkAssignment({
          title: formData.title,
          description: formData.description,
          deadline: formData.deadline,
          lesson_id: parseInt(formData.lessonId),
          file: fileToUpload,
        })
      ).unwrap();

      reset();
      setDragKey((k) => k + 1);

      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Error creating homework:", error);
    }
  };

  const isLoading = submissionLoading || isSubmitting;

  const lessonOptions = lessons
    .filter((lesson) => !lesson.homework)
    .map((lesson) => ({
      value: lesson.id.toString(),
      label: `${lesson.group_name} - ${lesson.name}`,
    }));

  const today = new Date().toISOString().split("T")[0];

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Создать домашнее задание"
      size="lg"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {submissionError && (
          <div
            style={{
              color: "red",
              backgroundColor: "#ffebee",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ffcdd2",
            }}
          >
            {submissionError}
          </div>
        )}

        <div>
          <h4>Название</h4>
          <InputField
            {...register("title", { required: "Название обязательно" })}
            placeholder="Введите название домашнего задания..."
            fullWidth
            isShadow
          />
          {errors.title && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.title.message}
            </span>
          )}
        </div>

        <div>
          <h4>Описание задания</h4>
          <TextArea
            {...register("description", { required: "Описание обязательно" })}
            placeholder="Введите описание задания..."
            fullWidth
            isShadow
          />
          {errors.description && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.description.message}
            </span>
          )}
        </div>

        <div>
          <h4>Файл (необязательно)</h4>
          <DragAndDrop
            key={dragKey}
            selectedFiles={fileInput}
            onFileSelect={(files) => {
              setValue("file", files ?? undefined);
            }}
            accept={".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"}
            multiple={false}
            disabled={isLoading}
            isLoading={isLoading}
            buttonText="Выберите файл"
          />
          {fileInput && fileInput[0] && (
            <div
              style={{
                marginTop: "5px",
                fontSize: "14px",
                color: "#666",
              }}
            >
              Выбран файл: {(fileInput[0] as File)?.name}
            </div>
          )}
        </div>

        <div>
          <h4>Дедлайн</h4>
          <InputField
            {...register("deadline", { required: "Дедлайн обязателен" })}
            type="datetime-local"
            min={today}
            fullWidth
            isShadow
          />
          {errors.deadline && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.deadline.message}
            </span>
          )}
        </div>

        <div>
          <h4>Выбор урока</h4>
          <SelectField
            {...register("lessonId", { required: "Выберите урок" })}
            options={lessonOptions}
            placeholder="Выберите урок..."
            fullWidth
            isShadow
          />
          {errors.lessonId && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.lessonId.message}
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <button
            type="submit"
            className={styles.save__button}
            disabled={isLoading}
          >
            {isLoading ? "Создание..." : "Создать задание"}
          </button>
        </div>
      </form>
    </ProfileModal>
  );
};

export default HomeworkCreateModal;
