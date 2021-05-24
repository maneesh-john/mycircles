import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import colors from "../../../../constants/colors";
import { SvgCssUri } from "react-native-svg";
import fonts from "../../../../constants/fonts";

const StoryDoctor = (props: any) => {
  const info = Array.isArray(props.userAbout) ? props.userAbout[0] : props.userAbout;
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>About</Text>
        </View>
        <Text style={styles.value}>{info?.about}</Text>
      </View>
      {Object.keys(info).length < 1 ? (
        <View style={{ marginTop: 40 }}>
          <Text
            style={{
              color: "#888",
              width: "100%",
              textAlign: "center",
              fontFamily: fonts.LATO_REGULAR,
            }}
          >
            No data found
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>
                LANGUAGE SPOKEN ({info?.language_spoken?.length})
              </Text>
            </View>
            {info?.language_spoken?.map((lang: any) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 5,
                }}
                key={lang.id}
              >
                <View style={styles.icon}>
                  <SvgCssUri width="100%" height="100%" uri={lang.icon} />
                </View>
                <Text style={{ ...styles.value, marginLeft: 10 }}>
                  {lang.language}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>
                INTRESTED AREAS ({info?.interested_areas?.length})
              </Text>
            </View>
            {info?.interested_areas?.map((lang: any) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 5,
                }}
                key={lang.id}
              >
                <View style={styles.icon}>
                  <SvgCssUri width="100%" height="100%" uri={lang.icon} />
                </View>
                <Text style={{ ...styles.value, marginLeft: 10 }}>
                  {lang.name}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>
                CONDITIONS TREATED ({info?.conditions_treated?.length})
              </Text>
            </View>
            {info?.conditions_treated?.map((lang: any) => (
              <View
                style={{ flexDirection: "row", alignItems: "center" }}
                key={lang.id}
              >
                <Entypo
                  name="dot-single"
                  color={"#ccc"}
                  style={{ marginRight: 5 }}
                  size={16}
                />
                <Text style={styles.value}>{lang.condition}</Text>
              </View>
            )) < Text}
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>
                PROCEDURES PERFORMED ({info?.procedures_performed?.length})
              </Text>
            </View>
            {info?.procedures_performed?.map((lang: any) => (
              <View
                style={{ flexDirection: "row", alignItems: "center" }}
                key={lang.id}
              >
                <Entypo
                  name="dot-single"
                  color={"#ccc"}
                  style={{ marginRight: 5 }}
                  size={16}
                />
                <Text style={styles.value}>{lang.procedure}</Text>
              </View>
            ))}
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>
                ACCEPTED INSURANCE ({info?.accepted_insurance?.length})
              </Text>
            </View>
            {info?.accepted_insurance?.map((lang: any) => (
              <View
                style={{ flexDirection: "row", alignItems: "center" }}
                key={lang.id}
              >
                <Entypo
                  name="dot-single"
                  color={"#ccc"}
                  style={{ marginRight: 5 }}
                  size={16}
                />
                <Text style={styles.value}>{lang.carrier}</Text>
              </View>
            ))}
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>HOSPITAL AFFILIATIONS</Text>
            </View>
            {info?.hospital_affiliations.map((hospital: any) => (
              <View key={hospital.id} style={styles.subcontainer}>
                {hospital.picture ? (
                  <View style={styles.imgHolder}>
                    <Image
                      source={{ uri: hospital.picture }}
                      style={styles.iconImg}
                    />
                  </View>
                ) : null}
                <View style={styles.info}>
                  {hospital.hospital_name ? (
                    <Text style={styles.value}>
                      {hospital.hospital_name} ({hospital.hospital_type})
                    </Text>
                  ) : null}
                  {hospital.address ? (
                    <Text style={styles.value}>{hospital.address}</Text>
                  ) : null}
                  {hospital.email ? (
                    <Text style={styles.value}>{hospital.email}</Text>
                  ) : null}
                  {hospital.phone_number ? (
                    <Text style={styles.value}>{hospital.phone_number}</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>BOARD CERTIFICATIONS</Text>
            </View>
            {info?.board_certifications?.map((board_certifications: any) => (
              <View key={board_certifications.id} style={styles.subcontainer}>
                {board_certifications.image ? (
                  <View style={styles.imgHolder}>
                    <SvgCssUri
                      width="100%"
                      height="100%"
                      uri={board_certifications.image}
                    />
                  </View>
                ) : null}
                <View style={styles.info}>
                  {board_certifications.speciality ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Speciality:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {board_certifications.speciality?.name}
                      </Text>
                      <View style={{ ...styles.icon, marginLeft: 5 }}>
                        <SvgCssUri
                          width="100%"
                          height="100%"
                          uri={board_certifications.speciality?.icon}
                        />
                      </View>
                    </View>
                  ) : null}
                  {board_certifications.expire_date ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Expire Date:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {board_certifications.expire_date}
                      </Text>
                    </View>
                  ) : null}
                  {board_certifications.initial_date ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Initial Date:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {board_certifications.initial_date}
                      </Text>
                    </View>
                  ) : null}
                  {board_certifications.accreditation ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Accreditation:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {board_certifications.accreditation.name}
                      </Text>
                    </View>
                  ) : null}
                  {board_certifications.recertification_date ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Recertification Date:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {board_certifications.recertification_date}
                      </Text>
                    </View>
                  ) : null}
                  {board_certifications.recertification_expire ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Recertification Expire:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {board_certifications.recertification_expire}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>STATE LICENSURE</Text>
            </View>
            {info?.state_licensure?.map((state_licensure: any) => (
              <View key={state_licensure.id} style={styles.subcontainer}>
                {state_licensure.image ? (
                  <View style={styles.imgHolder}>
                    <SvgCssUri
                      width="100%"
                      height="100%"
                      uri={state_licensure.image}
                    />
                  </View>
                ) : null}
                <View style={styles.info}>
                  {state_licensure.license_number ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>License Number:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {state_licensure.license_number}
                      </Text>
                    </View>
                  ) : null}
                  {state_licensure.state ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>State:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {state_licensure.state}
                      </Text>
                    </View>
                  ) : null}
                  <View style={styles.rowItem}>
                    <Text style={styles.key}>Status:</Text>
                    <Text style={{ ...styles.value, width: "60%" }}>
                      {state_licensure.is_active ? "Active" : "Not Active"}
                    </Text>
                  </View>
                  {state_licensure.issue_date ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Issue Date:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {state_licensure.issue_date}
                      </Text>
                    </View>
                  ) : null}
                  {state_licensure.expire_date ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Expiry Date:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {state_licensure.expire_date}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>ACADEMIC AFFILIATIONS</Text>
            </View>
            {info?.academic_affiliations?.map((academic_affiliations: any) => (
              <View key={academic_affiliations.id} style={styles.subcontainer}>
                {academic_affiliations.image ? (
                  <View style={styles.imgHolder}>
                    <SvgCssUri
                      width="100%"
                      height="100%"
                      uri={academic_affiliations.image}
                    />
                  </View>
                ) : null}
                <View style={styles.info}>
                  {academic_affiliations.name_of_organization ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Name of Organization:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {academic_affiliations.name_of_organization}
                      </Text>
                    </View>
                  ) : null}
                  <View style={styles.rowItem}>
                    <Text style={styles.key}>Affiliation:</Text>
                    <Text style={{ ...styles.value, width: "60%" }}>
                      {academic_affiliations.currently_affiliated
                        ? "Affiliated"
                        : "Not Affiliated"}
                    </Text>
                  </View>
                  {academic_affiliations.from_date ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Issue Date:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {academic_affiliations.from_date}
                      </Text>
                    </View>
                  ) : null}
                  {academic_affiliations.to_date ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Expiry Date:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {academic_affiliations.to_date}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>MEDICAL SCHOOL</Text>
            </View>
            {info?.medical_school?.map((medical_school: any) => (
              <View key={medical_school.id} style={styles.subcontainer}>
                {medical_school.image ? (
                  <View style={styles.imgHolder}>
                    <SvgCssUri
                      width="100%"
                      height="100%"
                      uri={medical_school.image}
                    />
                  </View>
                ) : null}
                <View style={styles.info}>
                  {medical_school.degrees ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Degree:</Text>
                      <Text
                        style={{
                          ...styles.value,
                          width: "60%",
                          textTransform: "none",
                        }}
                      >
                        {medical_school.degrees}
                      </Text>
                    </View>
                  ) : null}
                  {medical_school.year_of_completion ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Year Of Completion:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {medical_school.year_of_completion}
                      </Text>
                    </View>
                  ) : null}
                  {medical_school.academic_awards ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Academic Awards:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {medical_school.academic_awards}
                      </Text>
                    </View>
                  ) : null}
                  {medical_school.university ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>University:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {medical_school.university?.name}
                      </Text>
                    </View>
                  ) : null}
                  {medical_school.city ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>City:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {medical_school.city}
                      </Text>
                    </View>
                  ) : null}
                  {medical_school.state ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>State:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {medical_school.state}
                      </Text>
                    </View>
                  ) : null}
                  {medical_school.country ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Country:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {medical_school.country?.name}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>RESIDENCY</Text>
            </View>
            {info?.residency?.map((residency: any) => (
              <View key={residency.id} style={styles.subcontainer}>
                {residency.image ? (
                  <View style={styles.imgHolder}>
                    <SvgCssUri
                      width="100%"
                      height="100%"
                      uri={residency.image}
                    />
                  </View>
                ) : null}
                <View style={styles.info}>
                  {residency.city ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>City:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {residency.city}
                      </Text>
                    </View>
                  ) : null}
                  {residency.state ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>State:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {residency.state}
                      </Text>
                    </View>
                  ) : null}
                  {residency.country ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Country:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {residency.country?.name}
                      </Text>
                    </View>
                  ) : null}
                  {residency.date_to ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Date To:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {residency.date_to}
                      </Text>
                    </View>
                  ) : null}
                  {residency.date_from ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Date From:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {residency.date_from}
                      </Text>
                    </View>
                  ) : null}
                  {residency.university ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>University:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {residency.university?.name}
                      </Text>
                    </View>
                  ) : null}
                  {residency.physician_speciality ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Physician Speciality:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {residency.physician_speciality?.name}
                      </Text>
                      <View style={{ ...styles.icon, marginLeft: 5 }}>
                        <SvgCssUri
                          width="100%"
                          height="100%"
                          uri={residency.physician_speciality?.icon}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>CHIEF RESIDENCY</Text>
            </View>
            {info?.chief_residency?.map((chief_residency: any) => (
              <View key={chief_residency.id} style={styles.subcontainer}>
                {chief_residency.image ? (
                  <View style={styles.imgHolder}>
                    <SvgCssUri
                      width="100%"
                      height="100%"
                      uri={chief_residency.image}
                    />
                  </View>
                ) : null}
                <View style={styles.info}>
                  {chief_residency.city ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>City:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {chief_residency.city}
                      </Text>
                    </View>
                  ) : null}
                  {chief_residency.state ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>State:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {chief_residency.state}
                      </Text>
                    </View>
                  ) : null}
                  {chief_residency.country ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Country:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {chief_residency.country?.name}
                      </Text>
                    </View>
                  ) : null}
                  {chief_residency.date_to ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Date To:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {chief_residency.date_to}
                      </Text>
                    </View>
                  ) : null}
                  {chief_residency.date_from ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Date From:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {chief_residency.date_from}
                      </Text>
                    </View>
                  ) : null}
                  {chief_residency.university ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>University:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {chief_residency.university?.name}
                      </Text>
                    </View>
                  ) : null}
                  {chief_residency.physician_speciality ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Physician Speciality:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {chief_residency.physician_speciality?.name}
                      </Text>
                      <View style={{ ...styles.icon, marginLeft: 5 }}>
                        <SvgCssUri
                          width="100%"
                          height="100%"
                          uri={chief_residency.physician_speciality?.icon}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>OTHER EDUCATION</Text>
            </View>
            {info?.other_education?.map((other_education: any) => (
              <View key={other_education.id} style={styles.subcontainer}>
                {other_education.imagge ? (
                  <View style={styles.imgHolder}>
                    <SvgCssUri
                      width="100%"
                      height="100%"
                      uri={other_education.imagge}
                    />
                  </View>
                ) : null}
                <View style={styles.info}>
                  {other_education.city ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>City:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {other_education.city}
                      </Text>
                    </View>
                  ) : null}
                  {other_education.state ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>State:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {other_education.state}
                      </Text>
                    </View>
                  ) : null}
                  {other_education.country ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Country:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {other_education.country?.name}
                      </Text>
                    </View>
                  ) : null}
                  {other_education.date_to ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Date To:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {other_education.date_to}
                      </Text>
                    </View>
                  ) : null}
                  {other_education.degrees ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Degree:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {other_education.degrees}
                      </Text>
                    </View>
                  ) : null}
                  {other_education?.program ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Program:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {other_education.program.name}
                      </Text>
                    </View>
                  ) : null}
                  {other_education.date_from ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Date From:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {other_education.date_from}
                      </Text>
                    </View>
                  ) : null}
                  {other_education.main_fields ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Main fields:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {other_education.main_fields?.name}
                      </Text>
                    </View>
                  ) : null}
                  {other_education.university ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>University:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {other_education.university?.name}
                      </Text>
                    </View>
                  ) : null}
                  {other_education.academic_awards ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Academic Awards:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {other_education.academic_awards}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>INTERNSHIP</Text>
            </View>
            {info?.internship?.map((internship: any) => (
              <View key={internship.id} style={styles.subcontainer}>
                {internship.image ? (
                  <View style={styles.imgHolder}>
                    <SvgCssUri
                      width="100%"
                      height="100%"
                      uri={internship.image}
                    />
                  </View>
                ) : null}
                <View style={styles.info}>
                  {internship.city ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>City:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {internship.city}
                      </Text>
                    </View>
                  ) : null}
                  {internship.state ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>State:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {internship.state}
                      </Text>
                    </View>
                  ) : null}
                  {internship.country ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Country:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {internship.country?.name}
                      </Text>
                    </View>
                  ) : null}
                  {internship.date_to ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Date To:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {internship.date_to}
                      </Text>
                    </View>
                  ) : null}
                  {internship.date_from ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Date From:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {internship.date_from}
                      </Text>
                    </View>
                  ) : null}
                  {internship.university ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>University:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {internship.university?.name}
                      </Text>
                    </View>
                  ) : null}
                  {internship.physician_speciality ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Physician Speciality:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {internship.physician_speciality?.name}
                      </Text>
                      <View style={{ ...styles.icon, marginLeft: 5 }}>
                        <SvgCssUri
                          width="100%"
                          height="100%"
                          uri={internship.physician_speciality?.icon}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>FELLOWSHIP</Text>
            </View>
            {info?.fellowship?.map((fellowship: any) => (
              <View key={fellowship.id} style={styles.subcontainer}>
                {fellowship.image ? (
                  <View style={styles.imgHolder}>
                    <SvgCssUri
                      width="100%"
                      height="100%"
                      uri={fellowship.image}
                    />
                  </View>
                ) : null}
                <View style={styles.info}>
                  {fellowship.city ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>City:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {fellowship.city}
                      </Text>
                    </View>
                  ) : null}
                  {fellowship.state ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>State:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {fellowship.state}
                      </Text>
                    </View>
                  ) : null}
                  {fellowship.country ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Country:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {fellowship.country?.name}
                      </Text>
                    </View>
                  ) : null}
                  {fellowship.date_to ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Date To:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {fellowship.date_to}
                      </Text>
                    </View>
                  ) : null}
                  {fellowship.date_from ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Date From:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {fellowship.date_from}
                      </Text>
                    </View>
                  ) : null}
                  {fellowship.university ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>University:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {fellowship.university?.name}
                      </Text>
                    </View>
                  ) : null}
                  {fellowship.physician_speciality ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.key}>Physician Speciality:</Text>
                      <Text style={{ ...styles.value, width: "60%" }}>
                        {fellowship.physician_speciality?.name}
                      </Text>
                      <View style={{ ...styles.icon, marginLeft: 5 }}>
                        <SvgCssUri
                          width="100%"
                          height="100%"
                          uri={fellowship.physician_speciality?.icon}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: colors.secondary,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
    marginBottom: 20,
  },
  subcontainer: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: colors.secondary,
    overflow: "hidden",
    marginBottom: 20,
    borderColor: "#ccc",
    borderWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 17,
    fontFamily: fonts.LATO_BOLD,
    flex: 1,
    textTransform: "uppercase",
    color: "#333",
  },
  edit: {
    height: 30,
    width: 30,
    padding: 5,
    overflow: "hidden",
    textAlign: "center",
    borderRadius: 15,
  },
  contentHolder: {},
  content: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  value: {
    color: "#333",
    textTransform: "capitalize",
    marginBottom: 3,
    letterSpacing: 0.3,
    fontFamily: fonts.LATO_REGULAR,
  },
  icon: {
    height: 25,
    width: 25,
    borderRadius: 13,
    borderColor: "#ccc",
    borderWidth: 0.5,
    overflow: "hidden",
  },
  iconImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imgHolder: {
    height: 70,
    width: 70,
    borderRadius: 15,
    marginRight: 5,
    overflow: "hidden",
  },
  info: {
    flex: 1,
    paddingHorizontal: 5,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  key: {
    marginBottom: 3,
    fontFamily: fonts.LATO_BOLD,
    marginRight: 5,
    width: "30%",
  },
});

export default StoryDoctor;
