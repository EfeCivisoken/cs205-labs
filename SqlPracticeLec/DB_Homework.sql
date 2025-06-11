PRAGMA foreign_keys = ON;

-- Region, District, Ward, and Municipality Tables
CREATE TABLE Region (
    region_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE District (
    district_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    region_id INTEGER NOT NULL,
    FOREIGN KEY (region_id) REFERENCES Region(region_id) ON DELETE CASCADE
);

CREATE TABLE Ward (
    ward_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    district_id INTEGER NOT NULL,
    FOREIGN KEY (district_id) REFERENCES District(district_id) ON DELETE CASCADE
);

CREATE TABLE Municipality (
    municipality_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ward_id INTEGER NOT NULL,
    FOREIGN KEY (ward_id) REFERENCES Ward(ward_id) ON DELETE CASCADE
);

-- User Table 
CREATE TABLE User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    type TEXT NOT NULL
);

-- Facility Table
CREATE TABLE Facility (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    common_name TEXT,
    type TEXT,
    status TEXT,
    phone_number TEXT,
    address TEXT,
    email TEXT,
    website TEXT,
    location INTEGER NOT NULL,
    FOREIGN KEY (location) REFERENCES Municipality(municipality_id) ON DELETE CASCADE
);

-- FacilityEmployee Table (Correcting FK issue)
CREATE TABLE FacilityEmployee (
    facility_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (facility_id, user_id),
    FOREIGN KEY (facility_id) REFERENCES Facility(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
);

-- Review Table (Fixing FK Constraint)
CREATE TABLE Review (
    review_id INTEGER PRIMARY KEY AUTOINCREMENT,
    facility_id INTEGER NOT NULL,
    phone_number TEXT,
    age INTEGER,
    gender INTEGER,
    pregnant INTEGER,
    service_seeked INTEGER,
    asked_for_consent INTEGER,
    received_all_needed_services INTEGER,
    why_not_recieved_all_services INTEGER,
    attended_on_time INTEGER,
    vitals_measured INTEGER,
    wait_for_vital_signs INTEGER,
    wait_after_vitals INTEGER,
    comfortable_seating INTEGER,
    clearly_explained_tests INTEGER,
    got_all_tests_needed INTEGER,
    reason_didnt_get_tests INTEGER,
    all_medicines_available INTEGER,
    why_not_get_all_medicine INTEGER,
    informed_how_to_take_medicine INTEGER,
    satisfied_with_privacy INTEGER,
    satisfied_with_cleanliness INTEGER,
    treated_politely INTEGER,
    how_paid INTEGER,
    overall_satisfaction INTEGER,
    area_satisfied_most INTEGER,
    area_satisfied_least INTEGER,
    other_feedback TEXT,
    other_feedback_sentiment REAL,
    FOREIGN KEY (facility_id) REFERENCES Facility(id) ON DELETE CASCADE
);

-- AlternativeFeedback Table
CREATE TABLE AlternativeFeedback (
    alternative_feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
    facility_id INTEGER NOT NULL,
    alternative_feedback_date TEXT NOT NULL,
    alternative_feedback_text TEXT,
    alternative_feedback_sentiment REAL,
    FOREIGN KEY (facility_id) REFERENCES Facility(id) ON DELETE CASCADE
);

-- UserJurisdiction Table 
CREATE TABLE UserJurisdiction (
    user_id INTEGER NOT NULL,
    region INTEGER,
    district INTEGER,
    ward INTEGER,
    municipality INTEGER,
    PRIMARY KEY (user_id, region, district, ward, municipality),
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (region) REFERENCES Region(region_id) ON DELETE SET NULL,
    FOREIGN KEY (district) REFERENCES District(district_id) ON DELETE SET NULL,
    FOREIGN KEY (ward) REFERENCES Ward(ward_id) ON DELETE SET NULL,
    FOREIGN KEY (municipality) REFERENCES Municipality(municipality_id) ON DELETE SET NULL
);
