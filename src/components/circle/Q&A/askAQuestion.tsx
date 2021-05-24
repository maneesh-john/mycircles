import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  PermissionsAndroid,
  Alert,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ImagePicker from "react-native-image-picker";
import Geolocation from "react-native-geolocation-service";
import fonts from "../../../constants/fonts";
import SelectCategory from "./selectCategory";
import {
  processAndUploadImage,
  requestToAdd,
} from "../../../redux/actions/profileActions";
import colors from "../../../constants/colors";
import { postQuestion } from "../../../redux/actions/profileActions";
import { useDispatch } from "react-redux";

const AskAQuestion = (props: any) => {
  const dispatch = useDispatch();

  const {
    color,
    questionCategories,
    selectedCircle,
    userData,
    setselectedTab,
    prefillData,
  }: any = props;
  const [selectedCategory, setselectedCategory] = useState<any>();
  const [openCategoryModal, setopenCategoryModal] = useState<boolean>(false);
  const [question, setquestion] = useState<string>("");
  const [description, setdescription] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const [selectedImages, setSelectedImages] = useState<Array<any>>([]);
  const [selectedImageNames, setSelectedImageNames] = useState<Array<string>>(
    []
  );
  const [uploading, setUploading] = useState<boolean>(false);

  const onSelect = (type?: any) => {
    setopenCategoryModal(false);
    setselectedCategory(type);
  };

  useEffect(() => {
    preFillData();
  }, []);
  useEffect(() => {
    preFillData();
  }, [questionCategories]);

  const preFillData = () => {
    if (prefillData && questionCategories.length > 0) {
      let correctedType =
        prefillData.type == "others" ? "other" : prefillData.type;
      let type = questionCategories.filter((item: any) => {
        return (
          item.display_name.toLowerCase() == correctedType.toLowerCase() ||
          item.key_name.toLowerCase() == correctedType.toLowerCase()
        );
      });
      if (type.length > 0) {
        setselectedCategory(type[0]);
      }
      let descriptionText = `Name : ${prefillData.name} \nBrand : ${prefillData.brand} \nManufacturer : ${prefillData.manufacturer}`;
      setdescription(descriptionText);
    }
  };

  const chooseImage = async () => {
    const options = {
      title: "Select Image",
      storageOptions: {
        skipBackup: true,
        path: "images",
        cameraRoll: true,
        waitUntilSaved: true,
      },
    };
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        const file: any = {
          uri:
            Platform.OS === "android"
              ? response.uri
              : response.uri.replace("file://", ""),
          name: response.fileName
            ? response.fileName
            : `random_image.${response.type?.split("/")[1]}`,
          type: response.type,
        };
        setUploading(true);
        const filename: string = await processAndUploadImage(file);
        file.id = selectedImages.length + 1;
        setSelectedImageNames((prev) => [...prev, filename]);
        setSelectedImages((prev) => [...prev, file]);
        setUploading(false);
      }
    });
  };

  const removeImage = (index: number) => {
    setSelectedImageNames((prev) => {
      const _state = [...prev];
      _state.splice(index, 1);
      return _state;
    });
    setSelectedImages((prev) => {
      const _state = [...prev];
      _state.splice(index, 1);
      return _state;
    });
  };

  const checkValidity = (): boolean => {
    let valid: boolean = true;
    let _errors: any = {
      question: false,
      category: false,
      description: false,
    };
    if (!question) {
      valid = false;
      _errors.question = true;
    }
    if (!selectedCategory) {
      valid = false;
      _errors.category = true;
    }
    if (!description) {
      valid = false;
      _errors.description = true;
    }
    setErrors(_errors);
    return valid;
  };

  const getLocations = async () => {
    try {
      let permisson;
      if (Platform.OS === "android") {
        permisson = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      } else if (Platform.OS === "ios") {
        permisson = await Geolocation.requestAuthorization("whenInUse");
      }
      if (permisson === "granted") {
        Geolocation.getCurrentPosition(
          (position) => {
            postAQuestion(position);
          },
          (error) => {},
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const postAQuestion = async (location: any) => {
    const body = {
      user_circle: selectedCircle.id,
      category: selectedCategory.display_name,
      question: question,
      question_description: description,
      question_attach: selectedImageNames?.length ? selectedImageNames : null,
      latlong: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      user: userData.id,
    };
    try {
      await dispatch(postQuestion(body));
      setselectedTab(0);
    } catch (error) {
      Alert.alert("Oops", error.message);
    }
  };

  const askQuestion = async () => {
    const isValid = checkValidity();
    if (isValid) {
      getLocations();
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ask a Question</Text>
        <TextInput
          placeholder="Please be specific and consise"
          placeholderTextColor="#888"
          maxLength={140}
          style={styles.input}
          value={question}
          onChangeText={(value: any) => setquestion(value)}
        />
        <View style={styles.row}>
          <Text style={styles.error}>
            {errors.question ? `Required` : null}
          </Text>
          <Text style={styles.textCount}>
            Characters remaining: {140 - question.length}
          </Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Category</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setopenCategoryModal(true);
          }}
          style={styles.category}
        >
          <Text style={styles.categoryText}>
            {selectedCategory
              ? selectedCategory.display_name
              : `Select category`}
          </Text>
          <AntDesign
            name="down"
            size={18}
            color={"#333"}
            style={{ paddingRight: 5 }}
          />
        </TouchableOpacity>
        <Text style={styles.error}>
          {errors.category ? `Choose a category` : null}
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Additional Details</Text>
        <View style={styles.inputHolder}>
          <TextInput
            style={{ ...styles.textarea }}
            placeholder="Describe your day"
            placeholderTextColor="#888"
            maxLength={3000}
            multiline={true}
            numberOfLines={8}
            value={description}
            onChangeText={(value: any) => setdescription(value)}
          />
          <View style={[styles.row, styles.btnContainer]}>
            <MaterialCommunityIcons
              onPress={chooseImage}
              name="camera"
              size={34}
              color={color}
              style={{}}
            />
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            {selectedImages.length ? (
              <View style={styles.commentImagesContainer}>
                {selectedImages.map((img: any, ind: number) => (
                  <View key={img.id} style={styles.commentImages}>
                    <MaterialCommunityIcons
                      onPress={() => {
                        removeImage(ind);
                      }}
                      name="close-circle-outline"
                      size={20}
                      color={"red"}
                      style={{
                        position: "absolute",
                        zIndex: 10,
                        right: -8,
                        top: -8,
                      }}
                    />
                    <Image
                      source={{ uri: img.uri }}
                      style={{ ...styles.image, borderRadius: 5 }}
                    />
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.error}>
            {errors.description ? `Required` : null}
          </Text>
          <Text style={styles.textCount}>
            Characters remaining: {3000 - description.length}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        disabled={uploading}
        activeOpacity={0.7}
        onPress={askQuestion}
        style={{ ...styles.sumbit, backgroundColor: color }}
      >
        {uploading && <ActivityIndicator size={16} color={"#888"} />}
        <Text style={styles.sumbitText}>Ask</Text>
      </TouchableOpacity>

      {openCategoryModal && (
        <SelectCategory
          color={color}
          selectedCategory={selectedCategory}
          onSelect={onSelect}
          openCategoryModal={openCategoryModal}
          setopenCategoryModal={setopenCategoryModal}
          questionCategories={questionCategories}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  section: {
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputHolder: {
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
  },
  label: {
    fontFamily: fonts.LATO_BOLD,
    marginBottom: 5,
  },
  textarea: {
    fontFamily: fonts.LATO_REGULAR,
    textAlignVertical: "top",
    minHeight: 180,
    padding: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    fontFamily: fonts.LATO_REGULAR,
  },
  category: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingVertical: 14.5,
    marginBottom: 5,
  },
  categoryText: {
    flex: 1,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 14,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  error: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 12,
    color: "red",
  },
  textCount: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 12,
    color: "#888",
  },
  commentImagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },
  commentImages: {
    height: 90,
    width: 90,
    padding: 5,
    borderRadius: 5,
    margin: 5,
    borderWidth: 0.5,
    borderColor: "#ccc",
  },
  btnContainer: {
    marginHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderColor: "#888",
    justifyContent: "flex-end",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  sumbit: {
    marginVertical: 15,
    paddingVertical: 10,
    alignSelf: "center",
    paddingHorizontal: 30,
    borderRadius: 15,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sumbitText: {
    color: colors.secondary,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 15,
    paddingHorizontal: 5,
  },
});
export default AskAQuestion;
