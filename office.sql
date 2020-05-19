-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 17, 2019 at 02:39 AM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `office`
--

-- --------------------------------------------------------

--
-- Table structure for table `assignment`
--

CREATE TABLE `assignment` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `vendorDetails` varchar(25) NOT NULL DEFAULT 'Printing',
  `noOfUnits` int(11) NOT NULL DEFAULT 0,
  `vendorStatus` varchar(50) DEFAULT NULL,
  `InstallationPictures` tinyint(4) NOT NULL DEFAULT 0,
  `MidMonthReporting` tinyint(4) NOT NULL DEFAULT 0,
  `CampaignEndPictures` tinyint(4) NOT NULL DEFAULT 0,
  `WorkOrderSent` tinyint(4) NOT NULL DEFAULT 0,
  `VendorForm` tinyint(4) NOT NULL DEFAULT 0,
  `WorkOrderSentVendor` tinyint(4) NOT NULL DEFAULT 0,
  `InvoiceReceivedVendor` tinyint(4) NOT NULL DEFAULT 0,
  `FilingDoneInvoices` tinyint(4) NOT NULL DEFAULT 0,
  `AccountingDoneTally` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `assignment`
--

INSERT INTO `assignment` (`id`, `project_id`, `vendor_id`, `vendorDetails`, `noOfUnits`, `vendorStatus`, `InstallationPictures`, `MidMonthReporting`, `CampaignEndPictures`, `WorkOrderSent`, `VendorForm`, `WorkOrderSentVendor`, `InvoiceReceivedVendor`, `FilingDoneInvoices`, `AccountingDoneTally`) VALUES
(1, 1, 1, 'Printing', 7, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(2, 2, 1, 'Printing', 0, NULL, 1, 1, 1, 1, 0, 0, 0, 0, 0),
(3, 1, 1, 'Reprinting', 0, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `brand` varchar(25) NOT NULL,
  `client_id` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `brand`, `client_id`) VALUES
(1, 'Atta + Besan', 1),
(2, 'KGMO', 1);

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `name` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `name`) VALUES
(1, 'Adani Wilmar');

-- --------------------------------------------------------

--
-- Table structure for table `directory`
--

CREATE TABLE `directory` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `phoneNo` varchar(50) DEFAULT NULL,
  `emailId` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `designation` varchar(50) DEFAULT NULL,
  `organization` varchar(50) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `notes` varchar(500) DEFAULT NULL,
  `lastUpdated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `directory`
--

INSERT INTO `directory` (`id`, `name`, `phoneNo`, `emailId`, `state`, `city`, `designation`, `organization`, `department`, `address`, `notes`, `lastUpdated`) VALUES
(1, 'ram', '9784561234', 'dfffs@hgjh.com', 'rqew', 'qeqweqew', 'weqwqe', 'wewqe', 'qweqwe', 'wqeewqeqw', 'qweewqewqw', '2019-10-07 10:23:39');

-- --------------------------------------------------------

--
-- Table structure for table `excel`
--

CREATE TABLE `excel` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `source` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `excel`
--

INSERT INTO `excel` (`id`, `name`, `source`) VALUES
(2, '1565156657227-Splash.xlsx', 1),
(13, '1565159416720-Midas Touch.xlsx', 1),
(22, '1565172039337-13254.xlsx', 0);

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `mediaoption` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `contactperson` varchar(50) DEFAULT NULL,
  `contactdetail` varchar(50) DEFAULT NULL,
  `vendorid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ppt`
--

CREATE TABLE `ppt` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `source` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ppt`
--

INSERT INTO `ppt` (`id`, `name`, `source`) VALUES
(2, '1565156681986-Splash.pptx', 1),
(6, '1565171986481-MIDAS TOUCH.pptx', 1),
(7, '1565171997865-12356.pptx', 0);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `projectHandler` varchar(25) NOT NULL,
  `month` varchar(25) NOT NULL,
  `year` varchar(25) NOT NULL,
  `client_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `mediaFormat` varchar(25) NOT NULL,
  `units` int(11) DEFAULT NULL,
  `mediaType` varchar(25) NOT NULL,
  `city` varchar(25) NOT NULL,
  `duration` varchar(25) DEFAULT NULL,
  `startDate` varchar(25) DEFAULT NULL,
  `endDate` varchar(25) DEFAULT NULL,
  `extension` tinyint(1) NOT NULL DEFAULT 0,
  `assignedTo` varchar(25) DEFAULT NULL,
  `Completed` varchar(11) NOT NULL DEFAULT 'Incomplete',
  `last_updated` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `POFromClient` tinyint(1) NOT NULL DEFAULT 0,
  `InvoiceSentClient` tinyint(1) NOT NULL DEFAULT 0,
  `CreativeRecievedClient` tinyint(1) NOT NULL DEFAULT 0,
  `MockUpReady` tinyint(1) NOT NULL DEFAULT 0,
  `CreativesApprovedClient` tinyint(1) NOT NULL DEFAULT 0,
  `CreativesSentVendor` tinyint(1) NOT NULL DEFAULT 0,
  `AlbumShared` tinyint(1) NOT NULL DEFAULT 0,
  `PORecievedClient` tinyint(1) NOT NULL DEFAULT 0,
  `InvoiceSentClientAccounts` tinyint(1) NOT NULL DEFAULT 0,
  `PISentClient` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `projectHandler`, `month`, `year`, `client_id`, `brand_id`, `mediaFormat`, `units`, `mediaType`, `city`, `duration`, `startDate`, `endDate`, `extension`, `assignedTo`, `Completed`, `last_updated`, `POFromClient`, `InvoiceSentClient`, `CreativeRecievedClient`, `MockUpReady`, `CreativesApprovedClient`, `CreativesSentVendor`, `AlbumShared`, `PORecievedClient`, `InvoiceSentClientAccounts`, `PISentClient`) VALUES
(1, '17', 'June', '2019', 1, 1, 'BQS', 142, 'NL + BL', 'Mumbai', '15 Days', '2019-06-15', '2019-06-30', 0, '16', 'Completed', '2019-08-09 09:48:49', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(2, '17', 'june', '2019', 1, 2, 'Hoardings & BQS', 18, 'NL', 'Lucknow', '15 Days', '2019-06-01', '2019-06-15', 0, '18', 'On Hold', '2019-08-09 09:48:40', 1, 1, 0, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(25) NOT NULL,
  `password` varchar(500) NOT NULL,
  `designation` varchar(25) NOT NULL,
  `office_id` varchar(25) NOT NULL,
  `email` varchar(25) NOT NULL,
  `phone_no` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `password`, `designation`, `office_id`, `email`, `phone_no`) VALUES
(17, 'gaurav', '$2b$10$bZLac1euarKSnHEn6y8WZuQ6eiUU.sOox3JusihoOTLsjVTP/r4Hi', 'admin', 'jgjyghg', 'hgdjsg@c.hj', '765764764'),
(20, 'sam', '$2b$10$8ja30VRjLzlxBMiaYlZ4P.V9P5xsoNIZzDD.HyWJVJHKU/cM/EKlq', 'alliance', 'aabc', 'gshs@gs.sd', '7894561237'),
(21, 'sham', '$2b$10$IFzgY4ZgZJMcNU6/z2s2v.haa9y3r/SVyclhCX0t5YsQBadITvaGO', 'coordinator', 'hgjh', 'gghjgjds@hgj.sda', '7846512395');

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `id` int(11) NOT NULL,
  `organizationType` varchar(25) DEFAULT NULL,
  `vendorName` varchar(25) DEFAULT NULL,
  `officeAddress` varchar(100) DEFAULT NULL,
  `ocity` varchar(25) DEFAULT NULL,
  `opinCode` int(10) DEFAULT NULL,
  `ostate` varchar(25) DEFAULT NULL,
  `registeredAddress` varchar(100) DEFAULT NULL,
  `rcity` varchar(25) DEFAULT NULL,
  `rpinCode` int(10) DEFAULT NULL,
  `rstate` varchar(25) DEFAULT NULL,
  `website` varchar(25) DEFAULT NULL,
  `materialDescription` varchar(100) DEFAULT NULL,
  `serviceDescription` varchar(100) DEFAULT NULL,
  `contactPersonName` varchar(25) DEFAULT NULL,
  `mobileNo` int(25) DEFAULT NULL,
  `landlineNo` int(25) DEFAULT NULL,
  `faxNo` text DEFAULT NULL,
  `emailId` varchar(25) DEFAULT NULL,
  `bankName` varchar(25) DEFAULT NULL,
  `nameOfBank` varchar(25) DEFAULT NULL,
  `bankBranch` varchar(25) DEFAULT NULL,
  `accountNumber` int(25) DEFAULT NULL,
  `ifscCode` varchar(25) DEFAULT NULL,
  `cancelledCheque` varchar(255) DEFAULT NULL,
  `gstPercentage` varchar(10) DEFAULT NULL,
  `tdsPercentage` varchar(10) DEFAULT NULL,
  `gstNo` varchar(25) DEFAULT NULL,
  `stateCode` int(5) DEFAULT NULL,
  `hsnCode` int(10) DEFAULT NULL,
  `panNo` varchar(25) DEFAULT NULL,
  `msmed` varchar(25) DEFAULT NULL,
  `accountExtra0` varchar(255) DEFAULT NULL,
  `accountExtra1` varchar(255) DEFAULT NULL,
  `accountExtra2` varchar(255) DEFAULT NULL,
  `accountExtra3` varchar(255) DEFAULT NULL,
  `accountExtra4` varchar(255) DEFAULT NULL,
  `accountExtra5` varchar(255) DEFAULT NULL,
  `accountExtra6` varchar(255) DEFAULT NULL,
  `accountExtra7` varchar(255) DEFAULT NULL,
  `accountExtra8` varchar(255) DEFAULT NULL,
  `accountExtra9` varchar(255) DEFAULT NULL,
  `personName` varchar(25) DEFAULT NULL,
  `designation` varchar(25) DEFAULT NULL,
  `vendorRoundStamp` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`id`, `organizationType`, `vendorName`, `officeAddress`, `ocity`, `opinCode`, `ostate`, `registeredAddress`, `rcity`, `rpinCode`, `rstate`, `website`, `materialDescription`, `serviceDescription`, `contactPersonName`, `mobileNo`, `landlineNo`, `faxNo`, `emailId`, `bankName`, `nameOfBank`, `bankBranch`, `accountNumber`, `ifscCode`, `cancelledCheque`, `gstPercentage`, `tdsPercentage`, `gstNo`, `stateCode`, `hsnCode`, `panNo`, `msmed`, `accountExtra0`, `accountExtra1`, `accountExtra2`, `accountExtra3`, `accountExtra4`, `accountExtra5`, `accountExtra6`, `accountExtra7`, `accountExtra8`, `accountExtra9`, `personName`, `designation`, `vendorRoundStamp`) VALUES
(1, 'outdoor media', 'fortune brand ', 'noida', 'uttar pradesh', 200021, 'Uttar Pradesh', 'noida', 'uttar pradesh', 200021, 'Uttar Pradesh', 'asbsjd@sdjbs.com', 'asadsd', 'dkasdjan', 'namm', 2147483647, 0, '', 'shivamrock0101@gmail.com', 'Shivam', 'HDFC Bank ', 'South ex', 2147483647, 'IFSC0000128', NULL, '18', '2', '07aassdfsdvfd15', 7, 9998989, 'sadmasnashnc', 'dl15158151', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'shivam', 'accounts ', NULL),
(2, NULL, 'PVR Ltd', 'Building 9A, 4th Floor, DLF Cybercity, Phase 3null', 'Gurgaon', 122001, 'Haryana', 'Building 9A, 4th Floor, DLF Cybercity, Phase 3null', 'Gurgaon', 122001, 'Haryana', NULL, NULL, NULL, 'Siddharth Sharma', 2147483647, NULL, NULL, 'siddharth.sharma@pvrcinem', NULL, NULL, NULL, NULL, NULL, NULL, '18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assignment`
--
ALTER TABLE `assignment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `directory`
--
ALTER TABLE `directory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `excel`
--
ALTER TABLE `excel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ppt`
--
ALTER TABLE `ppt`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assignment`
--
ALTER TABLE `assignment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `directory`
--
ALTER TABLE `directory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `excel`
--
ALTER TABLE `excel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ppt`
--
ALTER TABLE `ppt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
