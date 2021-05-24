import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import SelectCategory from "../../components/circle/Q&A/selectCategory";
import {
  getAllTreatments,
  getTreatments,
} from "../../redux/actions/profileActions";
import Links from "../../components/homeScreen/links";
import Feather from "react-native-vector-icons/Feather";

const options = [
  {
    id: 1,
    display_name: "Medication",
  },
  {
    id: 2,
    display_name: "Procedure",
  },
  {
    id: 3,
    display_name: "Activity",
  },
  {
    id: 4,
    display_name: "others",
  },
];

const TreatmentsScreen = (props: any) => {
  const dispatch = useDispatch();

  const { selectedCircle, userData } = useSelector((state: any) => state.app);
  const { treatments } = useSelector((state: any) => state.profile);
  const color = selectedCircle.color_code
    ? selectedCircle.color_code
    : colors.mainColor;

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [input, setinput] = useState<string>("");
  const [selectedCategory, setselectedCategory] = useState<any>();
  const [openCategoryModal, setopenCategoryModal] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      if (selectedCircle && selectedCircle.id) {
        setselectedCategory("");
        setinput("");
        dispatch(getAllTreatments(1, 100, input, selectedCircle.id));
      }
    });
    return unsubscribe;
  }, [props.navigation, dispatch, selectedCircle]);

  const onRefresh = () => {
    if (selectedCategory) {
      dispatch(
        getTreatments(selectedCategory.display_name, selectedCircle.id, input)
      );
    } else {
      dispatch(getAllTreatments(1, 100, input, selectedCircle.id));
    }
  };

  const search = () => {
    if (selectedCategory) {
      dispatch(
        getTreatments(selectedCategory.display_name, selectedCircle.id, input)
      );
    } else {
      dispatch(getAllTreatments(1, 100, input, selectedCircle.id));
    }
  };

  const onSelect = (type?: any) => {
    setopenCategoryModal(false);
    setselectedCategory(type);
  };

  const navigate = (treatment: any) => {
    props.navigation.navigate("TreatmentDetails", {
      ...treatment,
      color,
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.screen}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.body}>
        <View style={styles.container}>
          <Text style={styles.title}>{`TREATMENTS A-Z`}</Text>
          <Text style={styles.description}>
            You may add or edit the treatments you have undergone in the past,
            or currently undergoing from this section. You may choose from the
            list of medications taken/taking, procedures undergone (such as
            surgery), and add other treatment types.
          </Text>
          <View style={{ ...styles.section, borderColor: color }}>
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
                  : `Select Treatment`}
              </Text>
              <AntDesign
                name="down"
                size={18}
                color={"#333"}
                style={{ paddingRight: 5 }}
              />
            </TouchableOpacity>
            <View
              style={{ width: 1, height: 50, backgroundColor: color }}
            ></View>
            <TextInput
              style={styles.input}
              placeholder={"Treatment name"}
              placeholderTextColor="#888"
              value={input}
              onChangeText={(value: any) => setinput(value)}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={search}
              style={{ ...styles.btn, backgroundColor: color }}
            >
              <AntDesign name="search1" size={20} color={colors.secondary} />
            </TouchableOpacity>
            {openCategoryModal && (
              <SelectCategory
                color={color}
                selectedCategory={selectedCategory}
                onSelect={onSelect}
                openCategoryModal={openCategoryModal}
                setopenCategoryModal={setopenCategoryModal}
                questionCategories={options}
              />
            )}
          </View>
        </View>
        <View style={styles.treatmentsContainer}>
          {treatments?.length ? (
            treatments.map((rs: any) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigate(rs);
                }}
                style={styles.treatment}
                key={rs.id}
              >
                <Text style={styles.treatmentText} numberOfLines={3}>
                  {rs.display_name} ({rs.id})
                </Text>
                <Feather name={"arrow-right"} size={18} color={color} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ marginTop: 40 }}>
              <Text
                style={{ color: "#888", width: "100%", textAlign: "center" }}
              >
                No treatments found
              </Text>
            </View>
          )}
        </View>
      </View>
      <Links color={color} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    // padding: 15,
  },
  body: {
    padding: 15,
    backgroundColor: "#f6f6f6",
  },
  container: {
    padding: 15,
    backgroundColor: colors.secondary,
    borderRadius: 15,
    shadowColor: "#ccc",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  title: {
    fontSize: 18,
    paddingBottom: 8,
    fontFamily: fonts.LATO_BOLD,
  },
  description: {
    paddingBottom: 15,
    fontFamily: fonts.LATO_REGULAR,
  },
  tabs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 30,
    overflow: "hidden",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 5,
    flex: 1,
    textAlign: "center",
    fontFamily: fonts.LATO_BOLD,
    textTransform: "uppercase",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    borderWidth: 1,
    borderRadius: 15,
    height: 50,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    paddingHorizontal: 5,
    color: "#333",
    fontFamily: fonts.LATO_REGULAR,
  },
  category: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    paddingHorizontal: 3,
  },
  categoryText: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
    flex: 1,
    textTransform: "capitalize",
    fontFamily: fonts.LATO_REGULAR,
  },
  btn: {
    height: 50,
    width: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  treatmentsContainer: {
    marginVertical: 10,
  },
  treatment: {
    marginVertical: 5,
    padding: 15,
    backgroundColor: colors.secondary,
    borderRadius: 15,
    shadowColor: "#ccc",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
    flexDirection: "row",
    paddingRight: 25,
    alignItems: "center",
  },
  treatmentText: {
    fontFamily: fonts.LATO_BOLD,
    fontSize: 15,
    color: "#333",
    width: "100%",
    //marginBottom: 15,
  },
  readmore: {
    fontFamily: fonts.LATO_REGULAR,
    color: "#444",
    width: "100%",
    marginTop: 15,
    textAlign: "right",
  },
});

export default TreatmentsScreen;
