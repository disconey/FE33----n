import React, { useEffect, useMemo } from "react";
import pic from "img/0313337776.jpg";
import {
  BugOutlined,
  DeleteOutlined,
  EyeOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LockOutlined,
  ReadOutlined,
  SlackOutlined,
  SyncOutlined,
  TagsOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import useScrollToTop from "hooks/useSrcollToTop";
import qs from "qs";

import * as S from "./styles";
import { ROUTES } from "constants/routes";
import Comment from "layouts/UserLayout/components/Comment";
import { Link, generatePath, useParams } from "react-router-dom/dist";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetailRequest } from "redux/slicers/product.slice";
import { getChapterListRequest } from "redux/slicers/chapter.slice";
import { getReviewListRequest } from "redux/slicers/review.slice";
import { Breadcrumb, Space, Table, notification } from "antd";
import {
  followProductRequest,
  unFollowProductRequest,
} from "redux/slicers/follow.slice";
import { setFilterParams } from "redux/slicers/common.slice";

const DetailCard = () => {
  const { id } = useParams();
  useScrollToTop();
  const dispatch = useDispatch();
  const { productDetail } = useSelector((state) => state.product);
  const { chapterList } = useSelector((state) => state.chapter);
  const { userInfo } = useSelector((state) => state.auth);
  const { filterParams } = useSelector((state) => state.common);

  console.log(
    "🚀 ~ file: index.jsx:30 ~ DetailCard ~ chapterList:",
    chapterList
  );
  useEffect(() => {
    dispatch(getProductDetailRequest({ id: parseInt(id) }));
    dispatch(getChapterListRequest({ id: parseInt(id) }));
    dispatch(getReviewListRequest({ productId: parseInt(id) }));
  }, []);

  const renderProductChapter = (comicId, chapters) => {
    if (!chapters) return null;
    return chapters.map((item) => {
      return (
        <S.Li>
          <div style={{ display: "flex" }}>
            <S.SLink
              to={generatePath(ROUTES.CHAPTER_PAGE, {
                comicId: comicId,
                chapterId: item.id,
              })}
            >
              {item.name}
            </S.SLink>
            {item.price ? (
              <span style={{ color: "red" }}>
                <LockOutlined />
                {item.price}
              </span>
            ) : (
              ""
            )}
          </div>

          <S.TextP>1 Ngày trước</S.TextP>
          <S.TextP>928</S.TextP>
        </S.Li>
      );
    });
  };

  const isFollow = useMemo(
    () =>
      productDetail.data.follows?.some(
        (item) => item.userId === userInfo.data.id
      ),
    [productDetail.data.follows, userInfo.data.id]
  );

  const handleToggleFollow = () => {
    if (userInfo.data.id) {
      if (isFollow) {
        const followData = productDetail.data.follows?.find(
          (item) => item.userId === userInfo.data.id
        );
        dispatch(
          unFollowProductRequest({
            id: followData.id,
          })
        );
      } else {
        dispatch(
          followProductRequest({
            comicId: productDetail.data.id,
            userId: userInfo.data.id,
          })
        );
      }
    } else {
      notification.error({
        message: "Vui lòng đăng nhập để thực hiện chức năng này!",
      });
    }
  };
  return (
    <div>
      <S.DetailCard>
        <Breadcrumb
          items={[
            {
              title: (
                <Link to={ROUTES.USER.HOME}>
                  <Space>
                    <HomeOutlined />
                    <span>Trang chủ</span>
                  </Space>
                </Link>
              ),
            },
            {
              title: (
                <Link to={ROUTES.FITLER_SEARCH_PAGE}>Danh sách sản phẩm</Link>
              ),
            },
            {
              title: (
                <Link
                  to={{
                    pathname: ROUTES.FITLER_SEARCH_PAGE,
                    search: qs.stringify({
                      ...filterParams,
                      categoryId: [productDetail.data.categoryId],
                    }),
                  }}
                >
                  {productDetail.data.category?.name}
                </Link>
              ),
              onClick: () =>
                dispatch(
                  setFilterParams({
                    ...filterParams,
                    categoryId: [productDetail.data.categoryId],
                  })
                ),
            },
            {
              title: productDetail.data.name,
            },
          ]}
          style={{ marginBottom: 8 }}
        />
        <S.ContentDetail>
          <S.Img src={pic} alt="" />
          <div>
            <S.TitleDetail>{productDetail.data.name}</S.TitleDetail>
            <div>
              <S.CustomButton size={"large"}>
                {productDetail.data.category?.name}
              </S.CustomButton>
            </div>
            <S.ComicContent>
              <S.ItemDetailCard>
                <S.ItemSmall>
                  <SlackOutlined />
                  <p>Tình trạng</p>
                </S.ItemSmall>
                <p>{productDetail.data.status?.name}</p>
              </S.ItemDetailCard>
              <S.ItemDetailCard>
                <S.ItemSmall>
                  <SyncOutlined />
                  <p>Cập nhật</p>
                </S.ItemSmall>
                <p>24 phút trước</p>
              </S.ItemDetailCard>
              <S.ItemDetailCard>
                <S.ItemSmall>
                  <EyeOutlined />
                  <p>Lượt xem</p>
                </S.ItemSmall>
                <p>111,111</p>
              </S.ItemDetailCard>
              <S.ItemDetailCard>
                <S.ItemSmall>
                  <TagsOutlined />
                  <p>Lượt theo dõi</p>
                </S.ItemSmall>
                <p>1,999</p>
              </S.ItemDetailCard>
            </S.ComicContent>
            <div>
              <S.RedButton
                type="primary"
                icon={<ReadOutlined />}
                size={"large"}
                className="red"
              >
                Đọc từ đầu
              </S.RedButton>
              <S.GreenButton
                type="primary"
                icon={<ReadOutlined />}
                size={"large"}
                className="green"
              >
                Đọc mới nhất
              </S.GreenButton>
              <S.BasicButton
                type="primary"
                icon={isFollow ? <DeleteOutlined /> : <TagsOutlined />}
                size={"large"}
                className="blue"
                onClick={() => handleToggleFollow()}
              >
                {isFollow ? `Bỏ theo dõi` : `Theo dõi`}
              </S.BasicButton>
              <S.YellowButton
                type="primary"
                icon={<BugOutlined />}
                size={"large"}
                className="yellow"
              >
                Báo lỗi
              </S.YellowButton>
            </div>
          </div>
        </S.ContentDetail>
        <div>
          <h4>
            <InfoCircleOutlined /> Giới thiệu
          </h4>
          <p>{productDetail.data.description}</p>
        </div>
        <div>
          <h4>
            <UnorderedListOutlined /> Danh sách chương
          </h4>

          <S.ChapterTable>
            <S.TopTable>
              <S.Text>Chapter</S.Text>
              <S.Text>Cập nhật</S.Text>
              <S.Text>Lượt xem</S.Text>
            </S.TopTable>
            <div>
              <S.Ul>
                {renderProductChapter(
                  productDetail.data.id,
                  productDetail.data.chapters
                )}
              </S.Ul>
            </div>
          </S.ChapterTable>
        </div>
        <Comment />
      </S.DetailCard>
    </div>
  );
};

export default DetailCard;
