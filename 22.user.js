// ==UserScript==
// @name         22
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  ---
// @match        *://talent.shixizhi.huawei.com/*
// @downloadURL  https://raw.githubusercontent.com/DmytroPEAR/DevOps_lab2/main/22.user.js
// @updateURL    https://raw.githubusercontent.com/DmytroPEAR/DevOps_lab2/main/22.user.js
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    const MIN_SCORE = 0.43;

    // =========================
    // БАЗА ПИТАНЬ
    // answerText = ТІЛЬКИ ТЕКСТ ВІДПОВІДІ
    // =========================
   const DB = [

    // ===== SINGLE =====
    {
        type: "single",
        question: "Which of the following is the correct description of the sequence of image digitization process? ( )",
        answerText: "image sampling quantization coding digital signal"
    },
    {
        "type": "single",
        "question": "Which protocol can resolve domain names? (   )",
        "answerText": "DNS"
    },
    {
        "type": "single",
        "question": "How many bits are equal to one byte?  (   )",
        "answerText": "8"
    },
    {
        "type": "single",
        "question": "How many bytes does a MAC address consist of ? (   )",
        "answerText": "6"
    },
    {
        "type": "single",
        "question": "The routing protocol can implement which of the following functions?  (   )",
        "answerText": "Guide packet path selection"
    },
    {
        "type": "single",
        "question": "How many available IP addresses does a class C network segment have? (   )",
        "answerText": "254"
    },
    {
        "type": "single",
        "question": "Which of the following is the operating system platform of all Huawei data communication products based on the IP/ATM architecture? (   )",
        "answerText": "VRP"
    },
    {
        "type": "single",
        "question": "How many layers does the OSI reference model have?  (   )",
        "answerText": "7"
    },
    {
        "type": "single",
        "question": "In a WLAN, what fields or information can be used to search the AP? (   )",
        "answerText": "SSID"
    },
    {
        "type": "single",
        "question": "What is used in TCP to control traffic?  (   )",
        "answerText": "sliding window"
    },
    {
        "type": "single",
        "question": "Single choice：\n1. What is the communication range of a LAN?  (   )",
        "answerText": "1 km"
    },
    {
        "type": "single",
        "question": "Which of the followings are common network devices? (  )",
        "answerText": "Router, Switch, Firewall, AP"
    },
    {
        "type": "single",
        "question": "Which protocols are used to send and receive emails?  (  )",
        "answerText": "SMTP, POP3"
    },
    {
        "type": "single",
        "question": "Which protocols or fields can be used to identify network nodes?  (  )",
        "answerText": "MAC, IPv4, IPv6"
    },
    {
        "type": "single",
        "question": "which of the followings are common routing protocols ? (  )",
        "answerText": "OSPF, IS-IS, BGP"
    },
    {
        "type": "single",
        "question": "Which of the following two transmission modes are supported by the HDLC protocol ?  (  )",
        "answerText": "Synchronous transfer mode, Asynchronous Transfer Mode"
    },
    {
        "type": "single",
        "question": "Switches can be classified into the what of the following types based on their position on the network? (  )",
        "answerText": "Access switch, Aggregation switch, Core switch"
    },
    {
        "type": "single",
        "question": "which of the followings are the advantages of VLAN?  (  )",
        "answerText": "Preventing broadcast storms, Isolating broadcast domains"
    },
    {
        "type": "single",
        "question": "多选题：\n1. According to the network sharing service mode, computer networks can be divided into   (   ) ?",
        "answerText": "LAN, WAN, MAN"
    },
    {
        "type": "single",
        "question": "VLANs can be configured on device interfaces. (   )",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "WPA2 is more secure than WEP. (   )",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Both devices may have the same MAC address. (   )",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "Static routes need to be manually configured by the administrator. (   )",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Private IP addresses can be reused. (   )",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "The checksum field in the IP packet header ensures that no errors occurred during data transmission process.  (   )",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "The most common looback interface address is 127.0. 0.1. (   )",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "Ture/False：\n1. The network layer defines protocol port numbers for transmitting data, flow control, and error detection. (   )",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "Routing in IP networks is implemented by switching devices. (   )",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "One VLAN cannot be implemented on one switch or across switches. (   )",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "The HDLC protocol is based on the network layer. (   )",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "TCP ensures data transmission reliability. (   )",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "In order to solve the speed mismatch between the computer and the printer, a print data buffer is usually set. The host writes the data to be printed into the buffer in turn, queue up for printing, and the printer reads the data from the buffer in turn and prints. Which of the following is the logical structure of the buffer? （  ）",
        "answerText": "queue"
    },
    {
        "type": "single",
        "question": "To design an algorithm to judge whether the left and right parentheses in the expression are paired, which of the following data structures is the best solution? (  )",
        "answerText": "stack"
    },
    {
        "type": "single",
        "question": "Which of the following options is the purpose of data encryption? (  )",
        "answerText": "protect data content"
    },
    {
        "type": "single",
        "question": "Single choice：\n1. Which of the following descriptions of information and data is wrong? (  )",
        "answerText": "Usually, information and data are strictly distinguished."
    },
    {
        "type": "single",
        "question": "Which of the following is the correct description of the sequence of image digitization process? (  )",
        "answerText": "image  sampling  quantization  coding  digital signal"
    },
    {
        "type": "single",
        "question": "Which of the following is not a performance indicator of information compression technology? (  )",
        "answerText": "total compressed information"
    },
    {
        "type": "single",
        "question": "Which of the following descriptions about the common points between stack and queue is correct? (  )",
        "answerText": "insert and delete elements at the endpoint"
    },
    {
        "type": "single",
        "question": "Which of the following is the location where the stack is inserted and deleted? (  )",
        "answerText": "stack top"
    },
    {
        "type": "single",
        "question": "If it is known that the input sequence of a stack is 1, 2, 3,... n, and its output sequence is a1, a2, a3,..., an, if a1 = n, which of the following options is ai? (  )",
        "answerText": "n-i+1"
    },
    {
        "type": "single",
        "question": "Which of the following descriptions of the data storage structure is wrong? (  )",
        "answerText": "In computer, the storage structure of data is expressed by linear structure."
    },
    {
        "type": "single",
        "question": "If the input sequence of a stack is a, b, c, d, which of the following cannot be the output sequence of the stack? (  )",
        "answerText": "a，b，d"
    },
    {
        "type": "single",
        "question": "Which of the following descriptions about the characteristics of big data is wrong? (  )",
        "answerText": "high value density of data"
    },
    {
        "type": "single",
        "question": "Which of the following descriptions about reasons for the use of binary in computer system is wrong? (  )",
        "answerText": "It is different from the decimal system used in daily life."
    },
    {
        "type": "single",
        "question": "Which of the following options controls the process of data encryption and decryption? (  )",
        "answerText": "key"
    },
    {
        "type": "single",
        "question": "Which of the following descriptions about images is wrong? (  )",
        "answerText": "In black-and-white images, 0 represents pure white and 1 represents pure black."
    },
    {
        "type": "single",
        "question": "In the following description of data encryption, which items are wrong? (   )",
        "answerText": "The original data that needs to be encrypted is called ciphertext., In asymmetric cryptosystem, the public key is generally used for decryption and the private key is used for encryption."
    },
    {
        "type": "multiple",
        "question": "Multiple choice：\n1. Which of the following options are coding methods? (   )",
        "answerText": "LDPC, ISBN, QR code, Bar code"
    },
    {
        "type": "single",
        "question": "Which of the following description of digital signature are wrong? (   )",
        "answerText": "RSA algorithm cannot implement digital signature., Digital signature is the digital image of handwritten signature., Only the recipient can use the private key."
    },
    {
        "type": "single",
        "question": "Which of the following data structures belong to nonlinear data structures? (   )",
        "answerText": "graph, binary tree"
    },
    {
        "type": "single",
        "question": "What are the correct items in the following description of stack application scenarios? (   )",
        "answerText": "recursive call, function call, expression evaluation"
    },
    {
        "type": "single",
        "question": "In asymmetric cryptosystem, the encryption and decryption keys are the same, and the key distribution management is simple. (   )",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "In the queue, the end performing the insertion operation is called the queue head, and the end performing the deletion operation is called the queue tail. (   )",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "Ture/False：\n1. Data is the manifestation and carrier of information, and information is the connotation of data. Information is meaningful, while data is meaningless. (   )",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Hexadecimal is a common base system inside the computer, which can make up for the shortage of long writing digits of binary. (   )",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Data organization refers to organizing data with a certain logical relationship and configuring it in the memory of the computer according to a certain storage representation, so that the computer can meet the requirements of fast processing speed, less memory capacity and low cost. (   )",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "In asymmetric cryptosystem, the private key is used to verify the signature. (   )",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "It is forbidden to use lossy compression method to compress data, because it will make the original data unrecoverable. (   )",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "HDFS is an abbreviation of Hadoop Distributed File System, which can realize the distributed storage of files on multiple hosts through the network. (   )",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "In the computer, all information must be digitized into data before it can be stored, processed and transmitted. (   )",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Message digest refers to that messages (files) of any length can be converted into hash values of fixed length by means of hash function, and the original information can be inferred from the message digest. (   )",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "Which channel coding method is used in 5G control plane and it is the only channel coding method which has been proved to reach Shannon’s limit?",
        "answerText": "Polar coding"
    },
    {
        "type": "single",
        "question": "Which is the 3GPP’s first release early in the 3G era?",
        "answerText": "Release 1999"
    },
    {
        "type": "single",
        "question": "What is the target reliability of URLLC scenario?",
        "answerText": "99.9999%"
    },
    {
        "type": "single",
        "question": "What is the minimal air interface latency required by URLLC in 5G?",
        "answerText": "1 ms"
    },
    {
        "type": "single",
        "question": "What is the legal name of the 5th-generation communication system?",
        "answerText": "IMT-2020"
    },
    {
        "type": "single",
        "question": "Which technology can effectively improve the coverage performance of high frequency in 5G ?",
        "answerText": "Massive MIMO"
    },
    {
        "type": "single",
        "question": "What is the the number of connections required by mMTC in 5G?",
        "answerText": "1M machine connections per square km"
    },
    {
        "type": "single",
        "question": "Which of the following 5G application scenarios is not described in 3GPP Release 15?",
        "answerText": "mMTC"
    },
    {
        "type": "single",
        "question": "Which of the following is a URLLC service?",
        "answerText": "Internet of Vehicles"
    },
    {
        "type": "single",
        "question": "What’s the peak rate of 5G downlink theoretically?",
        "answerText": "20Gbps"
    },
    {
        "type": "single",
        "question": "Which of the following statements about the 5G core network are correct?",
        "answerText": "The core manages control data, that means it will recognize who you are and what rights you have to access the network ., The core recognize user data, like emails and videos, The core works like a packet sorting station in a courier company, like DHL., 5G core network is cloudified."
    },
    {
        "type": "single",
        "question": "In order to realize the full potential of network cloudification, which of the following groups need to work together?",
        "answerText": "Industrial users, Network operators, Cloud service providers, Equipment manufacturers"
    },
    {
        "type": "single",
        "question": "Which of the following services require MEC to effectively reduce latency?",
        "answerText": "AR navigation, VR teaching, Cloud gaming"
    },
    {
        "type": "single",
        "question": "Which of the following technologies are used in core network cloudification?",
        "answerText": "NFV, CUPS, Edge Computing"
    },
    {
        "type": "single",
        "question": "Which of the following are among the requirements that ITU set for IMT-2020 in 2015?",
        "answerText": "Peak rate of 20Gbps, High density of machine connections, Latency of less than 1ms."
    },
    {
        "type": "single",
        "question": "URLLC became available for deployment following 3GPP Release 15.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "The advantage of FR2 is that it can support a larger cell bandwidth than the FR1, so it can provide a higher peak rate .",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "5G is just a new wireless technology.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "5G networks can improve the coverage by using Massive MIMO (multiple-input multiple-output) antenna technology.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Based on the 3GPP (3rd Generation Partnership Project) protocol standardization process, the 5G protocol version will start from 3GPP Release 15.",
        "answerText": "True"
    },
        {
        "type": "single",
        "question": "Which of the following statements is incorrect about characteristics and application scenarios of communication technologies?",
        "answerText": "Video surveillance data is usually transmitted through GPRS. The bandwidth is about 1 Mbit/s."
    },
    {
        "type": "single",
        "question": "Which of the following is a network layer function of the IoT?",
        "answerText": "Terminal access and data transmission"
    },
    {
        "type": "single",
        "question": "Which of the following statements is incorrect about ZigBee?",
        "answerText": "ZigBee is a wireless communication technology with a long distance and low power consumption."
    },
    {
        "type": "single",
        "question": "Which of the following statements about the RF Mesh is incorrect?",
        "answerText": "The RF Mesh transmission layer complies with the TCP protocol to ensure reliable connections and implement neighbor discovery. correct"
    },
    {
        "type": "single",
        "question": "Which of the following statements about the home network development is incorrect?",
        "answerText": "On the home network, to broaden Wi-Fi coverage, the single-gateway centralized Wi-Fi coverage mode is used. correct"
    },
    {
        "type": "single",
        "question": "Which of the following deployment modes is used to deploy NB-IoT on the refarmed GSM frequency band?",
        "answerText": "Standalone deployment"
    },
    {
        "type": "single",
        "question": "Which of the following is not the advantage of small-packet fast transmission?",
        "answerText": "Longer data transmission distance"
    },
    {
        "type": "single",
        "question": "Which of the following communication technologies belong to LPWA?",
        "answerText": "NB-IOT, SigFox, LoRa"
    },
    {
        "type": "single",
        "question": "Which of the following are short-range wireless communication technologies?",
        "answerText": "ZigBee, Z-Wave"
    },
    {
        "type": "single",
        "question": "The smart home network consists of the basic broadband network and intelligent interconnection network. The smart home accesses broadband networks of carriers.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "If there is a large transformer near the PLC environment, the transformer might cause serious noise interference on communications.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "The MCL value of NB-IoT is 164, which increases by 30 dB compared with GPRS.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "Frequency hopping allows the physical channel for uplink data transmission to change constantly, avoiding sustained interference.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "The PLC technology refers to a communication mode in which data and media signals are transmitted using power lines.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "NB-IoT focuses on IoT and features wide coverage, low power consumption, high rate, and massive connections.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "Which of the following systems does not belong to the relational database management system?",
        "answerText": "IMS"
    },
    {
        "type": "single",
        "question": "When a university carries out online teaching, it has a student table “students” (including student ID and other information) and a student sign-in information table “sign_in_info” (including student ID, sign-in and other information). Now you need to get the information of students who have not signed in according to the student ID. Which command achieve this goal?",
        "answerText": "SELECT * FROM students WHERE id NOT IN (SELECT id FROM sign_in_info )"
    },
    {
        "type": "single",
        "question": "For student information table “staff_Info”, which of the following symbols is required to query all field information of the table?",
        "answerText": "*"
    },
    {
        "type": "single",
        "question": "In which clause should the join condition be placed when querying data from two tables?",
        "answerText": "WHERE"
    },
    {
        "type": "single",
        "question": "When the SQL statement executes a query, which of the following options is used to specify which table to query from? (",
        "answerText": "FROM"
    },
    {
        "type": "single",
        "question": "When the SQL statement executes a query, which of the following options is used to specify the column to query?",
        "answerText": "SELECT"
    },
    {
        "type": "single",
        "question": "Which of the following conceptual description of database system is wrong?",
        "answerText": "The operating system of the computer belongs to the database system."
    },
    {
        "type": "single",
        "question": "A database has table “T1”, and the engineer needs to clear the data of the table without modifying the table structure. Which of the following options can help the engineer clear the data in T1 table?",
        "answerText": "DELETE"
    },
    {
        "type": "single",
        "question": "A database has a table “pro_Info”, the table has a field “name”, and the data type is char (20). After inserting the string 'database' into “name”, how many bytes does the field occupy?",
        "answerText": "20"
    },
    {
        "type": "single",
        "question": "A school establishes an information table for students. In the \"contact address\" field, which of the following options is the most appropriate field type?",
        "answerText": "varchar"
    },
    {
        "type": "single",
        "question": "A table “score_Info”contains fields such as name, score, subject, etc. Which of the following SQL statements can be used to query subjects whose average score is greater than or equal to 80? ()？",
        "answerText": "SELECT subject,AVG(score) avg_score FROM score_info GROUP BY subject HAVING avg_score >= 80"
    },
    {
        "type": "single",
        "question": "In computer systems, binary number is used to represent floating-point number. Which digit of binary number represents positive and negative ()?",
        "answerText": "1st"
    },
    {
        "type": "single",
        "question": "Which of the following hexadecimal digit corresponds to the decimal number 13 ()?",
        "answerText": "D"
    },
    {
        "type": "single",
        "question": "Which of the following binary number corresponds to the decimal number 5 ()?",
        "answerText": "101"
    },
    {
        "type": "single",
        "question": "What base system is used to represent the number in the computer ()?",
        "answerText": "Binary"
    },
    {
        "type": "single",
        "question": "Which following options are correct for table definition operations?",
        "answerText": "Creating tables: CREATE TABLE, Modifying table properties: ALTER TABLE, Delete all data in the table: TRUNCATE TABLE"
    },
    {
        "type": "single",
        "question": "A school has a student score table, and the field \"score\" shall be accurate to 1 decimal place. In this case, which of the following types can be used for this field?",
        "answerText": "float(4,1), decimal(4,1)"
    },
    {
        "type": "single",
        "question": "Group query is a common query method in database query. Which of the following functions can GROUP BY clause play in SELECT statement?",
        "answerText": "Grouping data, User data aggregation, For HAVING clause"
    },
    {
        "type": "single",
        "question": "What are the main contents of data-driven production mode?",
        "answerText": "User, Products, Data"
    },
    {
        "type": "single",
        "question": "Which of the following options belong to the data model in the computer system?",
        "answerText": "Document model, Relational model"
    },
    {
        "type": "single",
        "question": "The data in the database is organized, described and stored according to a certain data model, with less redundancy, higher data independence and scalability, and can be shared by various users.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Database technological innovation is breaking the existing order, cloud, distributed and multimodal processing are the main trends in the future of databases.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Database design refers to the construction of an optimized database logical mode and physical structure for a given application environment, and the establishment of a database and its application system so that it can effectively store and manage data to meet the application needs of various users.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Among table query statements of database, the query results by using operator != are different from <>.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "A data table score_Info, which contains fields such as name, score, subject, etc. Using GROUP BY you can query the total score and average score of each student, but the order of the result set is not guaranteed.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Numbers in a computer can only represent positive and floating-point numbers, not strings.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "A relationship or table can be regarded as a collection of rows of data.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "In tables of a database system, each column represents an information or a record.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "In tables of a database system, each row represents an attribute.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "In computer systems, numeric information is represented by binary number, and positive numbers are represented by a sign bit of \"1\".",
        "answerText": "False"
    },
        {
        "type": "single",
        "question": "Which of the following service is used to provide block storage service?",
        "answerText": "EVS"
    },
    {
        "type": "single",
        "question": "In compute virtualization, which of the following allocates CPU and memory resources to VMs?",
        "answerText": "VMM (virtual machine manager) correct"
    },
    {
        "type": "single",
        "question": "Which of the followings is not feature of converged architecture of Data center?",
        "answerText": "Semi-open architecture correct"
    },
    {
        "type": "single",
        "question": "Huawei cloud computing has been layered, from bottom to top, they are:",
        "answerText": "physical resources, virtual resources, infrastructure, PaaS/SaaS products"
    },
    {
        "type": "single",
        "question": "Among the three modes of I/O virtualization, which of the following is the best-to-worst ranking of performance?",
        "answerText": "IO-through, Paravirtualization, Emulation"
    },
    {
        "type": "single",
        "question": "Which of the followings is the evolution path of the data center architecture?",
        "answerText": "single system->chimney architecture->converged architecture"
    },
    {
        "type": "single",
        "question": "Which of the followings are key points of data center?",
        "answerText": "Reliability, Flexibility, Green, Utilization of IT resource"
    },
    {
        "type": "single",
        "question": "Which of the followings are key technologies of a data center?",
        "answerText": "Cloud Computing, Security, Virtualization, Green facility"
    },
    {
        "type": "single",
        "question": "Of the public cloud characteristics, which of the following statements are correct?",
        "answerText": "on-demand self-service, resource pool virtualization, auto scaling"
    },
    {
        "type": "single",
        "question": "Which of the followings belong to compute virtualization?",
        "answerText": "CPU virtualization, Memory virtualization, I/O virtualization"
    },
    {
        "type": "single",
        "question": "Which of the following statements about computing virtualization of type I (bare metal) are correct?",
        "answerText": "The hypervisor runs directly on physical hardware., Applications cannot run directly on the VMM."
    },
    {
        "type": "single",
        "question": "Which of the following statements about the relationship between Host Machine and Guest Machine are correct?",
        "answerText": "After virtualization, one host machine can run only one hypervisor., After virtualization, multiple guest machines can run on one host machine."
    },
    {
        "type": "single",
        "question": "Which of the following statements can demonstrate the advantages of virtualization?",
        "answerText": "After virtualization, multiple VMs can run on a physical host at the same time., After virtualization, the CPU usage of a physical host can be improved., After virtualization, VMs can be migrated among multiple hosts., After virtualization, multiple operating systems can run on a physical host at the same time."
    },
    {
        "type": "single",
        "question": "From a computer system's point of view, any event that causes a system to shut down abnormally can be called a disaster. Which of the following are disaster types of DR?",
        "answerText": "Man-made damages, Device faults, Natural disasters"
    },
    {
        "type": "single",
        "question": "The number of EVS disks that can be attached to a VM is not limited",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "All servers, storage devices, and network resources must be virtualized for upper-layer management and scheduling.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "All open-source virtualization technologies are type 1 virtualization, while all closed-source ones are type 2 virtualization.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "Mainframes use the RISC instruction set, and they implement CPU virtualization by “Deprivileging and Trap-and-Emulation”",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "CMP stands for cloud management platform, it’s a system used to uniformly manage data center services",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Mainframes use the CISC instruction set, so they can implement CPU virtualization in a “Deprivileging and Trap-and-Emulation” way.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "In compute virtualization, the operating system running on a VM is called host OS.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "Virtualization technologies can improve hardware resource utilization and reduce operation and maintenance costs. Cloud computing also has these advantages. Therefore, cloud computing and virtualization technologies are inseparable.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Cloud management platforms are integrated products and can only be used to manage private clouds.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "Data center is data computing, exchange, and storage center of an enterprise. It provides a core computing environment for key service applications, and integrates and centrally manages enterprise data, applications, and physical or virtual devices.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "What the AI can help us to reduce the carbon emissions?",
        "answerText": "Optimize the cooling efficiency in data center"
    },
    {
        "type": "single",
        "question": "Where do many data center operators aim to locate their facilities?",
        "answerText": "Where they can harness natural cooling (green energy)"
    },
    {
        "type": "single",
        "question": "Which of the following equipment is not required for a clean communication site?",
        "answerText": "diesel generator"
    },
    {
        "type": "single",
        "question": "What is the most common clean energy source for communication sites?",
        "answerText": "solar energy"
    },
    {
        "type": "single",
        "question": "Which components are more prone to safety problems in electric vehicles?",
        "answerText": "Power battery"
    },
    {
        "type": "single",
        "question": "Fast charging platform will allow cars to be charged in minutes and provide it with a 200km driving range.",
        "answerText": "5 minutes"
    },
    {
        "type": "single",
        "question": "Energy efficiency of compressed air can achieve as high as .",
        "answerText": "80%"
    },
    {
        "type": "single",
        "question": "Which one is not the method of energy storage?",
        "answerText": "Solar energy"
    },
    {
        "type": "single",
        "question": "The output of solar panels can be the highest when the sun hits them at angle.",
        "answerText": "a perpendicular"
    },
    {
        "type": "single",
        "question": "According to IRENA, by , 42 % energy needs will be from renewables.",
        "answerText": "2030"
    },
    {
        "type": "single",
        "question": "Which cooling type can be used in the data center?",
        "answerText": "DX cooling, Liquid cooling, Free cooling (the cold air come from environment), Chilled water cooling"
    },
    {
        "type": "single",
        "question": "Which measures can reduce the carbon emissions of communication sites?",
        "answerText": "The indoor power equipment is reconstructed outdoors., AI that constantly analyzes wireless traffic patterns can turn down power on base stations when load in the vicinity is low., Connect solar energy to the communications base station as much as possible."
    },
    {
        "type": "single",
        "question": "Which are the advantages of lithium battery over lead acid battery?",
        "answerText": "Lithium battery is smaller for the same amount of power than lead acid battery., Lithium battery might end up cheaper than lead acid battery."
    },
    {
        "type": "single",
        "question": "Among the following statements, which are true?",
        "answerText": "Virtual power plants are systems that rely on software and a smart grid to remotely and automatically dispatch and optimize distributed energy resources., Artificial intelligence enables solar trackers to increase the output of solar farms., Virtual power plants can increase the dispatch efficiency of distributed energy."
    },
    {
        "type": "single",
        "question": "In data center facility operation, the main energy consumption part is cooling the data center.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Because base stations are the infrastructure to ensure human communication, all base stations should operate 24 hours a day.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "The AI BMS can efficiently and accurately detect the battery health status.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Flywheel generate power based on momentum.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Renewable energy is not stable.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Which cloud delivery model is deployed entirely outside a corporate firewall?",
        "answerText": "Public Cloud"
    },
    {
        "type": "single",
        "question": "A company builds a desktop cloud environment for employees to use. Which of the following cloud computing deployment mode is used?",
        "answerText": "Private cloud"
    },
    {
        "type": "single",
        "question": "Which type of models refers to the location and management of the cloud’s infrastructure?",
        "answerText": "Deployment"
    },
    {
        "type": "single",
        "question": "Which of the following is true about the on-demand self-service feature of cloud computing?",
        "answerText": "After determining the required cloud computing services, users can apply for cloud computing resources by themselves."
    },
    {
        "type": "single",
        "question": "Which of the following statements about the relationship between cloud computing and the Internet of Things is incorrect?",
        "answerText": "Without the support of cloud computing, the Internet of Things cannot transmit data."
    },
    {
        "type": "single",
        "question": "Which of the following is not an element of artificial intelligence?",
        "answerText": "Cognitive analysis capability"
    },
    {
        "type": "single",
        "question": "Which of the following describes the correct sequence of the cloud architecture from bottom to top?",
        "answerText": "Infrastructure layer, resource pool layer, cloud management layer, cloud service layer"
    },
    {
        "type": "single",
        "question": "Capital Expenses (CAPEX) refers to the costs of acquiring new infrastructure - for example, buying servers to set up on premises. Operating Expenses (OPEX) refers to the costs of ongoing ownership and maintenance. Which of the following is a true statement related to how Cloud computing can impact CAPEX and OPEX?",
        "answerText": "Moving to cloud computing generally shifts CAPEX to OPEX"
    },
    {
        "type": "single",
        "question": "Please visit the HUAWEI CLOUD official website (www.huaweicloud.com) and find out which of the following is not a compute service.",
        "answerText": "OBS"
    },
    {
        "type": "single",
        "question": "Which of the following cloud computing service modes is used to lease basic resources such as processing capability and network capacity?",
        "answerText": "Infrastructure as a service (IaaS)"
    },
    {
        "type": "single",
        "question": "Which of these should a company consider before adopting cloud computing technology?",
        "answerText": "All of the above"
    },
    {
        "type": "single",
        "question": "Which of the following is a feature of the cloud computing 1.0 era?",
        "answerText": "Mainly virtualization products, The virtualization technology is used to improve resource utilization."
    },
    {
        "type": "single",
        "question": "Which of the following statements about the broad network access feature of cloud computing are true?",
        "answerText": "Users can use purchased cloud computing resources through different terminals via internet., Users can use purchased cloud computing resources at any time via internet., Users can view the status of self-purchased cloud computing resources at any time via internet., Users can use self-purchased cloud computing resources in different locations via internet."
    },
    {
        "type": "single",
        "question": "Edge computing can efficiently save bandwidth and reduce latency, so it will replace cloud computing one day.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "Containers can be used to package software into standardized units for development, shipment and deployment",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Cloud-native features constructing and providing applications based on cloud characteristics.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Hybrid cloud is a deployment model that integrates features of the public cloud and private cloud.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "KVM and Xen are two typical open source virtualization solutions",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Cloud computing is a product of the development of the Internet and computing technologies. Therefore, cloud computing is inseparable from networks.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "In the cloud computing model, users do not need to know where servers are located or how internal operations are performed. Users can use resources transparently through the high-speed Internet.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Which of the below statements about 5G NSA networking is incorrect?",
        "answerText": "The UE signaling can be directly sent to the gNodeB."
    },
    {
        "type": "single",
        "question": "Which of the following technologies can shorten the air interface latency?",
        "answerText": "Flexible frame structure"
    },
    {
        "type": "single",
        "question": "In current eMBB scenario, what channel coding method is adopted on control channels of 5G air interface?",
        "answerText": "Polar"
    },
    {
        "type": "single",
        "question": "Which RAN structure will be separated into CU and DU two parts?",
        "answerText": "Cloud RAN"
    },
    {
        "type": "single",
        "question": "Which of the below frequency bands is the C-Band supported by 5G?",
        "answerText": "3.5GHz"
    },
    {
        "type": "single",
        "question": "In 5G system, spectrum utilization can be improved by using the F-OFDM technology. When the SCS is 30 kHz, which system bandwidth is of the maximum spectrum utilization?",
        "answerText": "100MHz"
    },
    {
        "type": "single",
        "question": "Which of the following statements about the causes of insufficient 5G uplink coverage is incorrect?",
        "answerText": "UE receiver sensitivity is poor."
    },
    {
        "type": "single",
        "question": "In 5G air interface which technology can increase spectral efficiency?",
        "answerText": "F-OFDM, LDPC code"
    },
    {
        "type": "single",
        "question": "Which position can deploy user plane to reduce the transmission latency?",
        "answerText": "Edge DC, Local DC"
    },
    {
        "type": "single",
        "question": "Which of the following frequency can be used for SUL?",
        "answerText": "2.1GHz, 900MHz, 1.8GHz"
    },
    {
        "type": "single",
        "question": "In order to save bandwidth, which scenario can adopt MEC?",
        "answerText": "Video Stream Analysis, Video Optimization"
    },
    {
        "type": "single",
        "question": "What gains can be realized by massive MIMO of 5G?",
        "answerText": "Beam forming, Array, Diversity, Multiplexing"
    },
    {
        "type": "single",
        "question": "Because of the high frequency band of millimeter wave, the penetration loss of it is very small.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "The SA mode of 5G network favors aggressive operators on fast deployment of 5G services based on 4G network.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "Based on the massive MIMO beam forming capability, 5G base stations can better support low-altitude coverage.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "The 5G network features high rate, low latency, and massive connections, and can better support vertical industry applications.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "C-band is the main frequency band of 5G. Currently, a maximum of 100 MHz bandwidth can be deployed. Uplink and downlink imbalance can be resolved by the uplink and downlink decoupling feature.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "To enhance the spectrum efficiency, massive MIMO technology is introduced in 5G network, whose maximum number of antennas may reach 64T64R.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Sub6G Hz includes sub3G Hz and C-band.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "uRLLC cannot be supported by NSA mode.",
        "answerText": "True"
    },

    {
        "type": "single",
        "question": "Which of the following is not an AI school of thought?",
        "answerText": "Logicism"
    },
    {
        "type": "single",
        "question": "Which of the following is NOT a controversy associated with AI developments?",
        "answerText": "Ransomware"
    },
    {
        "type": "single",
        "question": "What is the point of the Turing Test?",
        "answerText": "Determine when a machine thinks on its own"
    },
    {
        "type": "single",
        "question": "Which of the following is NOT among the top three technology directions for AI?",
        "answerText": "Autonomous driving"
    },
    {
        "type": "single",
        "question": "Who first came up with the phrase “artificial intelligence”?",
        "answerText": "John MacCarthy"
    },
    {
        "type": "single",
        "question": "Which of the below is most closely associated with connectionism?",
        "answerText": "Neuron"
    },
    {
        "type": "single",
        "question": "In May 1997, a computer defeated Garry Kasparov, a former world chess champion, by 3.5:2.5. What was the name of the computer?",
        "answerText": "Deep Blue"
    },
    {
        "type": "single",
        "question": "AI developers have been improving the efficiency of AI applications by designing smaller deep learning models. Which of the following are model reduction techniques?",
        "answerText": "Low rank approximation, Network pruning, Knowledge distillation"
    },
    {
        "type": "single",
        "question": "Which of these are AI development frameworks?",
        "answerText": "TensorFlow, MindSpore, Pytorch"
    },
    {
        "type": "single",
        "question": "Which of these are subsets of machine vision:",
        "answerText": "Image classification, Target detection"
    },
    {
        "type": "single",
        "question": "Which are AI application scenarios?",
        "answerText": "Healthcare, Autonomous driving, Machine vision"
    },
    {
        "type": "single",
        "question": "Which are the essential elements of AI?",
        "answerText": "Data, Learning algorithm, Computing powerApplication scenario, Application scenario"
    },
    {
        "type": "single",
        "question": "Choose the top three technology directions of AI:",
        "answerText": "Computer vision, Speech processing, Natural language processing"
    },
    {
        "type": "single",
        "question": "Machine learning algorithms are an essential part of all AI models",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Connectionism underpins the development of artificial neural networks.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "AI development requires the collaboration of experts from a wide range of disciplines.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "The major focus of AI research is the development of strong AI.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "Speech recognition is also called natural language processing.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "A decision tree providing medical diagnostics by asking questions to patients is an example of symbolic AI.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "Deep learning and machine learning are unrelated concepts.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "While designing their next-generation edge computing solution for an emerging technology company, the team decided to adopt OpenEuler and planned to leverage DSoftBus for device discovery and open connectivity. This decision is in line with future edge computing trends and enables self-connection, self-network connection, and failure recovery to multiple types and vendors of devices.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "When developing C programs, if you need to quickly check whether the length of a variable is as expected, use GCC's -O3 optimization level to perform compilation, which will help you achieve this goal.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "In Linux, net-tools is a set of tools used for network management. Its main function does not include network address translation (LAN/Wi-Fi).",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "When developing a high-performance embedded system based on Linux 5.10, is it right to choose GNU/Linux instead of VxWorks as the development platform considering the efficient management and stability of the system?",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "To ensure future login security during WordPress installation, you should create a separate database user for WordPress instead of operating as root.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "In Linux, iproute is used primarily for network management, including but not limited to static configuration of network interfaces.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "When developing an application based on the openEuler operating system, code compilation using the GCC compiler is not possible.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "After the fork system call is executed, the parent process's virtual address space and external resources are copied to the child process.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "When the find command is used to search for files, the xargs command can be used to count the number of lines in the found files.",
        "answerText": "True"
    },
    {
        "type": "single",
        "question": "In openEuler, x86 device management is implemented through a virtualized subsystem called KVM.",
        "answerText": "False"
    },
    {
        "type": "single",
        "question": "As a system administrator, you need to find a specific text file and change its permissions. Which of the following commands can help you achieve this?",
        "answerText": "find-typef-name\"example.txt\"-execchmod+x{}\\\\;"
    },
    {
        "type": "single",
        "question": "What are the main functions of the Bootloader during the development of embedded systems?",
        "answerText": "Loading the Operating System Kernel"
    },
    {
        "type": "single",
        "question": "When developing C programs, you need to quickly locate a specific location in the program and set breakpoints. Which command is the correct way to set breakpoints in the openEuler development environment?",
        "answerText": "gdb-gprogram.c"
    },
    {
        "type": "single",
        "question": "As a programmer, you are writing a program that determines whether the string entered by the user is empty. If the string length is greater than 0, the program should output \"Stringisnotempty\". Otherwise, the program should output \"Stringisempty.\". Which of the following commands is best used to implement this function?",
        "answerText": "`if(strlen(str)>0)fprintf(stdout, \"Stringisnotempty\");elsefprintf(stdout, \"Stringisempty\");`"
    },
    {
        "type": "single",
        "question": "Suppose you are the leader of a High Performance Computing (HPC) research team evaluating different virtualization technologies to improve your computing efficiency. If your team needed to quickly boot up virtual machines for massively parallel computing, while maintaining the isolation and security of traditional virtualization technologies, which virtualization technology would you choose?",
        "answerText": "StraoVirt"
    },
    {
        "type": "single",
        "question": "Which of the following is true about openEuler?",
        "answerText": "OpenEuler is an open source system based on the Linux kernel and supports diverse computing environments."
    },
    {
        "type": "single",
        "question": "During the installation of WordPress, which command should be used to grant WordPress user privileges to ensure that WordPress users can access the database?",
        "answerText": "createuserwordpress;"
    },
    {
        "type": "single",
        "question": "As a developer, you plan to choose an operating system for a new type of IoT device. If you need to make sure that the device can take advantage of the benefits of a multi-core chip and support both real-time operating systems and open Euric embedded systems, which of the following is the best option?",
        "answerText": "OpenEuler Embedded"
    },
    {
        "type": "single",
        "question": "Which of the following statements are true about the multi-core scheduler of openEuler?",
        "answerText": "Support for Coroutes in its kernel, allowing multiple tasks to be executed in a single thread, Distribute tasks across multiple CPU cores, maximizing hardware resource usage, improving user experience and performance, Dynamically adjust task allocation to ensure core load balancing and prevent performance bottlenecks."
    },
    {
        "type": "single",
        "question": "As a software development engineer, you are responsible for developing a Linux 5.10-based embedded system for a company. When considering Linux 5.10 for development, what do you need to look out for to ensure the stability and performance of your system?",
        "answerText": "Use the latest Linux 5.10 kernel to ensure system security and stability., Building systems with Linux 5.10 hardware and software resource limitations in mind, Ensure applications run efficiently and reliably on Linux 5.10, Consider using OpenEuler for system development, taking advantage of its comprehensive Linux-based software platform."
    },
    {
        "type": "single",
        "question": "When calculating the sum of 300.54 and 2448, which of the following is the key step that must be followed in the algorithm execution process?",
        "answerText": "Add digit by digit from right to left and handle carry-over"
    },

    {
        "type": "single",
        "question": "When using the Euclidean algorithm to calculate the greatest common divisor (GCD) of two natural numbers, what is the termination condition of the algorithm?",
        "answerText": "The remainder is 0"
    },

    {
        "type": "single",
        "question": "When calculating the greatest common divisor (GCD) of two natural numbers, which of the following methods usually has a higher computational efficiency?",
        "answerText": "Using the Euclidean algorithm"
    },
    {
        "type": "single",
        "question": "In the process of solving the root of an equation using the Newton-Raphson method, what is the key calculation step for each iteration?",
        "answerText": "Subtract the ratio of the function value to its derivative value from the current value"
    }

];

    GM_addStyle(`
        #ql-overlay {
            position: fixed;
            top: 14px;
            right: 14px;
            z-index: 999999;
            width: 390px;
            background: rgba(16, 18, 22, 0.96);
            color: #fff;
            border: 1px solid #3a3f48;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.35);
            padding: 12px;
            font-family: Arial, sans-serif;
        }
        #ql-overlay h3 {
            margin: 0 0 10px;
            font-size: 16px;
        }
        #ql-overlay .row {
            margin: 7px 0;
            font-size: 13px;
            line-height: 1.45;
        }
        #ql-overlay .label {
            color: #8fc7ff;
            font-weight: 700;
        }
        #ql-overlay .ok { color: #7fff9f; font-weight: 700; }
        #ql-overlay .warn { color: #ffd166; font-weight: 700; }
        #ql-overlay .bad { color: #ff8c8c; font-weight: 700; }
        #ql-overlay textarea {
            width: 100%;
            min-height: 64px;
            background: #0f1115;
            color: #dfe7ef;
            border: 1px solid #3a3f48;
            border-radius: 8px;
            padding: 8px;
            resize: vertical;
            font-size: 12px;
            box-sizing: border-box;
        }
        #ql-refresh, #ql-copy {
            margin-top: 8px;
            margin-right: 8px;
            padding: 7px 10px;
            border: none;
            border-radius: 7px;
            cursor: pointer;
            font-size: 13px;
        }
        #ql-refresh { background: #2c7be5; color: #fff; }
        #ql-copy { background: #2e8b57; color: #fff; }
        #ql-overlay.collapsed {
    width: 180px;
    height: auto;
    overflow: hidden;
}

#ql-overlay.collapsed textarea,
#ql-overlay.collapsed .row:not(:first-child) {
    display: none;
}

#ql-toggle {
    float: right;
    background: #444;
    color: #fff;
}#ql-overlay.collapsed {
    width: 180px;
    height: auto;
    overflow: hidden;
}

#ql-overlay.collapsed textarea,
#ql-overlay.collapsed .row:not(:first-child) {
    display: none;
}

#ql-toggle {
    float: right;
    background: #444;
    color: #fff;
}
    `);
     const STORAGE_KEY = "exam_db_session";

function loadSessionDB() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveSessionDB(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
    function normalize(text) {
    return String(text || "")
        .toLowerCase()
        .replace(/&quot;/g, '"')
        .replace(/，/g, ',')
        .replace(/。/g, '.')
        .replace(/：/g, ':')
        .replace(/；/g, ';')
        .replace(/（/g, '(')
        .replace(/）/g, ')')
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

    function tokenize(text) {
    return normalize(text).split(" ").filter(Boolean);
}

function unique(arr) {
    return [...new Set(arr)];
}

function overlapScore(a, b) {
    const aw = unique(tokenize(a));
    const bw = unique(tokenize(b));
    if (!aw.length || !bw.length) return 0;

    let hit = 0;
    for (const w of aw) {
        if (bw.includes(w)) hit++;
    }
    return hit / Math.max(aw.length, 1);
}

function detectType(text) {
    const t = normalize(text);
    if (t.includes("true or false") || t.includes("true false") || t.includes("true/false")) {
        return "true_false";
    }
    if (t.includes("multiple choice") || t.includes("multiple-answer") || t.includes("multiple answer")) {
        return "multiple";
    }
    return "single";
}

function exactBonus(a, b) {
    return normalize(a) === normalize(b) ? 1 : 0;
}

function containsBonus(a, b) {
    const na = normalize(a);
    const nb = normalize(b);

    if (!na || !nb) return 0;
    if (na.includes(nb) || nb.includes(na)) return 1;
    return 0;
}


function scoreEntry(pageQuestion, entry) {
    const exact = exactBonus(pageQuestion, entry.question);
    const contains = containsBonus(pageQuestion, entry.question);
    const overlap = overlapScore(pageQuestion, entry.question);

    return exact * 0.7 + contains * 0.15 + overlap * 0.15;
}

function getQuestionText() {
    const precise = document.querySelector('.subtitle .main-title .content');
    if (precise && precise.textContent.trim()) {
        return precise.textContent.trim();
    }

    const fallback = document.querySelector('.main-title .content');
    if (fallback && fallback.textContent.trim()) {
        return fallback.textContent.trim();
    }

    const candidates = [...document.querySelectorAll('.content')]
        .map(el => (el.textContent || '').trim())
        .filter(Boolean)
        .filter(t => t.length > 20 && (t.includes('?') || t.includes('(  )')));

    if (candidates.length) {
        return candidates[0];
    }

    return '';
}

function getVisibleOptionsText() {
    const items = [...document.querySelectorAll('.subect-label .option-list-item')];

    return items.map(item => {
        const orderEl = item.querySelector('.option-order-str');
        const textEl = item.querySelector('.option-content .content');

        const order = orderEl ? orderEl.textContent.trim() : '';
        const text = textEl ? textEl.textContent.trim() : '';

        return `${order}${text}`;
    }).filter(Boolean);
}

function getSelectedAnswerText() {
    // 1. Найчастіший варіант
    let selected = document.querySelector('.option-list-item.option-list-active');
    if (selected) {
        const textEl = selected.querySelector('.option-content .content');
        if (textEl && textEl.textContent.trim()) {
            return textEl.textContent.trim();
        }
    }

    // 2. Якщо вибір помічений через radio
    const checkedRadio = document.querySelector('.ant-radio-checked');
    if (checkedRadio) {
        const optionItem = checkedRadio.closest('.option-list-item');
        if (optionItem) {
            const textEl = optionItem.querySelector('.option-content .content');
            if (textEl && textEl.textContent.trim()) {
                return textEl.textContent.trim();
            }
        }
    }

    // 3. Якщо multiple-choice через checkbox
    const checkedCheckboxes = [...document.querySelectorAll('.ant-checkbox-checked')]
        .map(el => el.closest('.option-list-item'))
        .filter(Boolean);

    if (checkedCheckboxes.length) {
        const texts = checkedCheckboxes.map(item => {
            const textEl = item.querySelector('.option-content .content');
            return textEl ? textEl.textContent.trim() : "";
        }).filter(Boolean);

        return texts.join(", ");
    }

    return "";
}
function debugCurrentQuestion() {
    console.log("QUESTION:", getQuestionText());
    console.log("OPTIONS:", getVisibleOptionsText());
    console.log("SELECTED:", getSelectedAnswerText());
}
function findBestMatch(questionText) {
    const type = detectType(questionText);
    let best = null;

    for (const entry of DB) {
        if (entry.type !== type) continue;
        const score = scoreEntry(questionText, entry);
        if (!best || score > best.score) {
            best = { ...entry, score };
        }
    }

    return best;
}
    function exportDB() {
    const sessionDB = loadSessionDB();

    if (!sessionDB.length) {
        alert("Session DB порожня");
        return;
    }

    const text = JSON.stringify(sessionDB, null, 4);

    navigator.clipboard.writeText(text)
        .then(() => alert("DB скопійована в буфер"))
        .catch(() => alert("Помилка копіювання"));
}
function addCurrentToDB() {
    const question = getQuestionText();
    const answer = getSelectedAnswerText();
    const type = detectType(question);

    debugCurrentQuestion();

    if (!question || !answer) {
        alert("Нема питання або відповіді");
        return;
    }

    let sessionDB = loadSessionDB();

    const exists = sessionDB.some(q =>
        normalize(q.question) === normalize(question)
    );

    if (exists) {
        alert("Вже є в session DB");
        return;
    }

    const newItem = {
        type: type,
        question: question,
        answerText: answer
    };

    sessionDB.push(newItem);
    saveSessionDB(sessionDB);

    console.log("ADDED:", newItem);
    alert("Додано в session DB");
}
    function createOverlay() {
    const box = document.createElement("div");
    box.id = "ql-overlay";
    box.innerHTML = `
        <h3>Question Lookup <button id="ql-toggle">–</button></h3>
        <div class="row"><span class="label">Status:</span> <span id="ql-status">waiting...</span></div>
        <div class="row"><span class="label">Type:</span> <span id="ql-type">-</span></div>
        <div class="row"><span class="label">Confidence:</span> <span id="ql-score">-</span></div>

        <div class="row"><span class="label">Detected question:</span></div>
        <textarea id="ql-question" readonly></textarea>

        <div class="row"><span class="label">Answer text:</span></div>
        <textarea id="ql-answer" readonly></textarea>

        <div class="row"><span class="label">Matched question:</span></div>
        <textarea id="ql-match" readonly></textarea>

        <div class="row"><span class="label">Visible options:</span></div>
        <textarea id="ql-options" readonly></textarea>

        <button id="ql-refresh">Refresh</button>
        <button id="ql-copy">Copy answer</button>
        <button id="ql-add">Add</button>
        <button id="ql-export">Export DB</button>
        <button id="ql-clear">Clear DB</button>
    `;

    document.body.appendChild(box);

    document.getElementById("ql-refresh").addEventListener("click", updateOverlay);

    document.getElementById("ql-copy").addEventListener("click", async () => {
        const value = document.getElementById("ql-answer").value || "";
        if (!value) return;
        try {
            await navigator.clipboard.writeText(value);
            setStatus("answer copied", "ok");
        } catch {
            setStatus("copy failed", "bad");
        }
    });

    document.getElementById("ql-add").addEventListener("click", addCurrentToDB);

    document.getElementById("ql-export").addEventListener("click", exportDB);

    document.getElementById("ql-clear").addEventListener("click", () => {
        localStorage.removeItem(STORAGE_KEY);
        alert("Session DB очищена");
    });
        const toggleBtn = document.getElementById("ql-toggle");
const overlay = document.getElementById("ql-overlay");

// відновлення стану
if (localStorage.getItem("ql_collapsed") === "1") {
    overlay.classList.add("collapsed");
    toggleBtn.textContent = "+";
}

toggleBtn.addEventListener("click", () => {
    overlay.classList.toggle("collapsed");

    const isCollapsed = overlay.classList.contains("collapsed");

    toggleBtn.textContent = isCollapsed ? "+" : "–";

    localStorage.setItem("ql_collapsed", isCollapsed ? "1" : "0");
});
}
    function setStatus(text, cls = "") {
        const el = document.getElementById("ql-status");
        el.textContent = text;
        el.className = cls;
    }

    function updateOverlay() {
    const qText = getQuestionText();
    const options = getVisibleOptionsText();
    const detectedType = detectType(qText);
    const best = findBestMatch(qText);

    document.getElementById("ql-type").textContent = detectedType;
    document.getElementById("ql-question").value = qText || "";
    document.getElementById("ql-options").value = options.join('\n');

    if (!best) {
        setStatus("no candidate", "bad");
        document.getElementById("ql-score").textContent = "-";
        document.getElementById("ql-answer").value = "";
        document.getElementById("ql-match").value = "";
        return;
    }

    document.getElementById("ql-score").textContent = `${(best.score * 100).toFixed(1)}%`;
    document.getElementById("ql-match").value = best.question;

    if (best.score < MIN_SCORE) {
        setStatus("weak match / not found", "bad");
        document.getElementById("ql-answer").value = "Not found";
    } else if (best.score < 0.72) {
        setStatus("possible match", "warn");
        document.getElementById("ql-answer").value = best.answerText;
    } else {
        setStatus("strong match", "ok");
        document.getElementById("ql-answer").value = best.answerText;
    }
}
    function setupWatch() {
        let lastUrl = location.href;
        let lastSnapshot = "";

        setInterval(() => {
            const snapshot = (document.body?.innerText || "").slice(0, 5000);
            if (location.href !== lastUrl || snapshot !== lastSnapshot) {
                lastUrl = location.href;
                lastSnapshot = snapshot;
                updateOverlay();
            }
        }, 1200);
    }

    function init() {
        createOverlay();
        updateOverlay();
        setupWatch();
    }

    window.addEventListener("load", init);
})();