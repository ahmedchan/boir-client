/* eslint-disable react/prop-types */
import React, { useState } from "react"
import {
  Button,
  Table,
  Form,
  Dropdown,
  Spinner,
  Alert,
  Badge,
  Container
} from "react-bootstrap"
// import { IoTrashOutline } from "react-icons/io5"
import { MdOutlineEdit, MdOutlineRemoveRedEye } from "react-icons/md"
// import { AiOutlineFileText } from "react-icons/ai"
import { BsClock } from "react-icons/bs"
import { useNavigate, useParams, Link } from "react-router-dom"
import DeleteComponent from "@/components/DeleteComponent"
import { displayDateTime } from "@/utility/utils"
import {
  useGetReportsByCompanyIdQuery,
  useInitialEmptyReportMutation
} from "@/services/reports.sevice"
// icons
import { IoIosMore } from "react-icons/io"
import { useAuth } from "@/providers/AuthProvider"
import PayReportButton from "@/components/PayReportButton"

// Custom dropdown toggle button
// eslint-disable-next-line react/display-name
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <Button
    variant="link"
    className="p-0 text-dark"
    ref={ref}
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}
  >
    {children}
  </Button>
))

const BIORListing = () => {
  const navigate = useNavigate()
  const { auth } = useAuth()
  const params = useParams()
  const [dropdownOpen, setDropdownOpen] = useState([])
  const [newFilingError, setNewFilingError] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])

  // api
  const [initialEmptyReport, { isLoading: isCreating }] =
    useInitialEmptyReportMutation()
  const { data, isLoading, isError, error } = useGetReportsByCompanyIdQuery(
    { companyId: params.Clientid },
    { skip: !params.Clientid, refetchOnMountOrArgChange: true }
  )

  // Handle dropdown toggle
  const toggleDropdown = (index) => {
    const newDropdownOpen = [...dropdownOpen]
    newDropdownOpen[index] = !newDropdownOpen[index]
    setDropdownOpen(newDropdownOpen)
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(
        data?.reports?.$values
          ?.filter((i) => i.invoicePaid === 0)
          .map((item) => item.boireportId)
      )
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const createRportAndRedirect = async () => {
    if (!params.Clientid) return

    try {
      const resp = await initialEmptyReport({
        companyId: params.Clientid
      }).unwrap()
      const { boiReportId } = resp
      navigate(`addFiling/${boiReportId}`)
    } catch (error) {
      if (error?.data) {
        setNewFilingError(error?.data)
      } else {
        setNewFilingError("Something went wrong, please try later.")
      }
    }
  }

  const renderLoading = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="9" className="text-center">
            <Spinner size="lg" />
          </td>
        </tr>
      )
    }
  }

  const renderError = () => {
    if (isError) {
      return (
        <tr>
          <td colSpan="9">
            <Alert variant="danger">
              {error?.data || "Something went wrong, please try later."}
            </Alert>
          </td>
        </tr>
      )
    }
  }

  const renderData = () => {
    if (data && data?.reports?.$values.length > 0) {
      return data?.reports?.$values?.map((filing, index) => (
        <tr key={index}>
          <td>
            <Form.Check
              checked={selectedRows.includes(filing.boireportId)}
              disabled={filing?.invoicePaid !== 0}
              onChange={() => handleSelectRow(filing.boireportId)}
              aria-label={`Select row ${filing.boireportId}`}
            />
          </td>
          <td>{filing.reportNo}</td>
          <td>{filing.ein}</td>
          <td>{filing.companyName}</td>
          <td>
            {displayDateTime({ date: filing?.invoiceDate, isTimestamp: false })}
          </td>
          <td>{filing.biorstatusDesc}</td>
          <td>
            <Button
              variant="warning"
              size="sm"
              as={Link}
              to={`addFiling/${filing.boireportId}`}
            >
              <MdOutlineRemoveRedEye size={14} /> &nbsp;
              <span>View</span>
            </Button>
            {/* <Button variant="link" className="p-0 me-2">
                    <MdOutlineEdit size={16} />
                  </Button>
                  <Button variant="link" className="p-0 me-2">
                    <IoTrashOutline size={16} />
                  </Button>
                  <Button variant="link" className="p-0 me-2">
                    <MdOutlineRemoveRedEye size={16} />
                  </Button>
                  <Button variant="link" className="p-0">
                    <AiOutlineFileText size={16} />
                  </Button> */}
          </td>
          <td>
            {filing?.invoicePaid === 0 ? (
              <Badge bg="secondary">Unpaid</Badge>
            ) : (
              <Badge bg="primary">Paid</Badge>
            )}
          </td>
          <td>
            <Dropdown
              show={dropdownOpen[index]}
              onToggle={() => toggleDropdown(index)}
            >
              <Dropdown.Toggle as={CustomToggle} id={`dropdown-${index}`}>
                <IoIosMore size={16} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <BsClock size={14} className="me-2" /> History log
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={`addFiling/${filing.boireportId}`}>
                  <div>
                    <MdOutlineEdit size={14} className="me-2" /> Edit
                  </div>
                </Dropdown.Item>
                <Dropdown.Item as="div" onClick={(e) => e.stopPropagation()}>
                  <DeleteComponent onDelete={() => {}} />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </td>
        </tr>
      ))
    } else {
      return (
        <tr>
          <td colSpan="9" className="text-center">
            No reports found!
          </td>
        </tr>
      )
    }
  }

  return (
    <Container fluid className=" py-4">
      <h1 className="mb-4">
        <span className="text-muted text-capitalize">
          &lt;{data?.company?.companyName || auth?.user?.companyName}&gt;
        </span>{" "}
        BOIR Listing
      </h1>

      <div className="d-flex justify-content-between align-items-start gap-1 mb-4">
        <Form.Control
          type="search"
          placeholder="Search"
          className="me-2"
          style={{ maxWidth: "300px" }}
        />
        <div className="d-flex justify-content-between gap-1 ">
          {selectedRows.length > 0 ? (
            <PayReportButton reportIds={selectedRows} />
          ) : null}

          <Button
            onClick={createRportAndRedirect}
            variant="primary"
            disabled={isCreating}
          >
            {isCreating && (
              <>
                <Spinner size="sm" />
                &nbsp;
              </>
            )}
            New Filing
          </Button>
        </div>
      </div>

      {newFilingError ? (
        <div className="my-3">
          <Alert variant="danger">{newFilingError}</Alert>
        </div>
      ) : null}

      <Table bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                disabled={data?.reports?.$values?.length === 0}
                onChange={handleSelectAll}
                checked={
                  data?.reports?.$values?.length > 0 &&
                  selectedRows.length === data?.reports?.$values?.length
                }
                aria-label="Select all"
              />
            </th>
            <th>Boir No</th>
            <th>EIN</th>
            <th>Company Name</th>
            <th>Created Date</th>
            <th>File Status</th>
            <th>Actions</th>
            <th>Payment Status</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {renderLoading()}
          {renderError()}
          {renderData()}
        </tbody>
      </Table>
    </Container>
  )
}

export default BIORListing
