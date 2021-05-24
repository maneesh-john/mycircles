import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Links from "../../components/homeScreen/links";
import colors from "../../constants/colors";
import { useSelector } from "react-redux";
import fonts from "../../constants/fonts";
import SelectCategory from "../../components/circle/Q&A/selectCategory";

const SignupSelectionScreen = (props: any) => {
  const [role, setRole] = useState(0);
  const [subRole, setSubRole] = useState(0);
  const { selectedCircle, otherProfessionalTypes, adminTypes } = useSelector(
    (state: any) => state.app
  );
  const color = selectedCircle?.color_code
    ? selectedCircle?.color_code
    : colors.mainColor;
  const loginType = props.route.params.type;
  const prefillData = props.route.params.userData;

  const [openCategoryModal, setopenCategoryModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [categoryList, setCategoryList] = useState<Array<any>>([]);

  useEffect(() => {
    if (role !== 4) {
      setSubRole(0);
    }
  }, [role]);

  const selectACategory = (val: any) => {
    setSelectedCategory(val);
    setopenCategoryModal(false);
    if (val) {
      if (otherProfessionalTypes.indexOf(val) >= 0) {
        setRole(5);
      } else if (adminTypes.indexOf(val) >= 0) {
        setRole(6);
      }
    }
  };

  const navigate = () => {
    if (role < 5) {
      props.navigation.navigate("SignupFormsScreen", {
        selectedRole: role,
        type: loginType,
        prefillUserData: prefillData,
      });
    } else if (role === 5) {
    } else if (role === 6) {
      props.navigation.navigate("ClaimProfileScreen", {
        selectedCategory: selectedCategory,
        type: loginType,
        prefillUserData: prefillData,
      });
    }
  };

  return (
    <ScrollView style={styles.screen}>
      <View style={{ backgroundColor: colors.secondary, paddingBottom: 40 }}>
        <View style={styles.header}>
          <Text
            style={{
              ...styles.headerText,
              color: color ? color : colors.mainColor,
            }}
          >
            Welcome to {selectedCircle.condition_type} Circle
          </Text>
          <Text style={styles.headerDescription}>
            Please select what type of user you are.
          </Text>
        </View>
        <View style={styles.roleSection}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setRole(1)}
            style={{
              ...styles.itemStyle,
              backgroundColor: role === 1 && color ? color : colors.secondary,
              borderColor: color ? color : colors.mainColor,
            }}
          >
            <Text
              style={{
                ...styles.itemText,
                color: role === 1 ? colors.secondary : "#333",
              }}
            >
              Person with {selectedCircle.condition_type}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setRole(2)}
            style={{
              ...styles.itemStyle,
              backgroundColor: role === 2 && color ? color : colors.secondary,
              borderColor: color ? color : colors.mainColor,
            }}
          >
            <Text
              style={{
                ...styles.itemText,
                color: role === 2 ? colors.secondary : "#333",
              }}
            >
              Caregiver
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setRole(3)}
            style={{
              ...styles.itemStyle,
              backgroundColor: role === 3 && color ? color : colors.secondary,
              borderColor: color ? color : colors.mainColor,
            }}
          >
            <Text
              style={{
                ...styles.itemText,
                color: role === 3 ? colors.secondary : "#333",
              }}
            >
              Advocate
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setRole(4)}
            style={{
              ...styles.itemStyle,
              backgroundColor: role === 4 && color ? color : colors.secondary,
              borderColor: color ? color : colors.mainColor,
            }}
          >
            <Text
              style={{
                ...styles.itemText,
                color: role === 4 ? colors.secondary : "#333",
              }}
            >
              Physician
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setCategoryList(otherProfessionalTypes);
              setopenCategoryModal(true);
            }}
            style={[
              styles.itemStyle,
              styles.category,
              {
                backgroundColor: role === 5 && color ? color : colors.secondary,
                borderColor: color ? color : colors.mainColor,
              },
            ]}
          >
            <Text
              style={[
                styles.itemText,
                { flex: 1, color: role === 5 ? colors.secondary : "#333" },
              ]}
            >
              {selectedCategory?.display_name && role === 5
                ? selectedCategory.display_name
                : `Other Healthcare Professional`}
            </Text>
            <AntDesign
              name="down"
              size={18}
              color={role === 5 ? colors.secondary : "#333"}
              style={{ paddingRight: 5 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setCategoryList(adminTypes);
              setopenCategoryModal(true);
            }}
            style={[
              styles.itemStyle,
              styles.category,
              {
                backgroundColor: role === 6 && color ? color : colors.secondary,
                borderColor: color ? color : colors.mainColor,
              },
            ]}
          >
            <Text
              style={[
                styles.itemText,
                { flex: 1, color: role === 6 ? colors.secondary : "#333" },
              ]}
            >
              {selectedCategory?.display_name && role === 6
                ? selectedCategory.display_name
                : `Administrator`}
            </Text>
            <AntDesign
              name="down"
              size={18}
              color={role === 6 ? colors.secondary : "#333"}
              style={{ paddingRight: 5 }}
            />
          </TouchableOpacity>
        </View>

        {role === 4 ? (
          <View>
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                marginBottom: -10,
                fontFamily: fonts.LATO_BOLD,
              }}
            >
              What is your profession?
            </Text>
            <View style={styles.roleSection}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setSubRole(1)}
                style={{
                  ...styles.itemStyle,
                  backgroundColor:
                    subRole === 1 && color ? color : colors.secondary,
                  borderColor: color ? color : colors.mainColor,
                }}
              >
                <Text
                  style={{
                    ...styles.itemText,
                    color:
                      subRole === 1
                        ? colors.secondary
                        : color
                        ? color
                        : colors.mainColor,
                  }}
                >
                  Physician
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setSubRole(2)}
                style={{
                  ...styles.itemStyle,
                  backgroundColor:
                    subRole === 2 && color ? color : colors.secondary,
                  borderColor: color ? color : colors.mainColor,
                }}
              >
                <Text
                  style={{
                    ...styles.itemText,
                    color:
                      subRole === 2
                        ? colors.secondary
                        : color
                        ? color
                        : colors.mainColor,
                  }}
                >
                  Other
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {role ? (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={navigate}
            style={{
              ...styles.btn,
              backgroundColor: color ? color : colors.secondary,
              borderColor: color ? color : colors.mainColor,
            }}
          >
            <Text style={{ ...styles.itemText, color: colors.secondary }}>
              Next
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <Links color={color} />
      {openCategoryModal && (
        <SelectCategory
          color={color}
          selectedCategory={selectedCategory}
          onSelect={selectACategory}
          openCategoryModal={openCategoryModal}
          setopenCategoryModal={setopenCategoryModal}
          questionCategories={categoryList}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    minHeight: "100%",
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 60,
  },
  headerText: {
    fontSize: 24,
    fontFamily: fonts.LATO_BOLD,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  headerDescription: {
    marginTop: 5,
    fontSize: 14,
    textAlign: "center",
    fontFamily: fonts.LATO_REGULAR,
    letterSpacing: 0.3,
    color: "#333",
  },
  itemStyle: {
    flex: 1,
    minHeight: 50,
    paddingHorizontal: 25,
    justifyContent: "center",
    borderRadius: 30,
    marginVertical: 10,
    borderWidth: 1,
  },
  category: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  roleSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  itemText: {
    color: colors.secondary,
    textAlign: "center",
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 16,
    textAlignVertical: "center",
    paddingVertical: 5,
  },
  btn: {
    width: "30%",
    paddingVertical: 5,
    borderRadius: 30,
    marginRight: 20,
    alignSelf: "flex-end",
  },
});
export default SignupSelectionScreen;
