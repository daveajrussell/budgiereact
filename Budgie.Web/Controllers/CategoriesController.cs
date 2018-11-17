using System;
using AutoMapper;
using Budgie.Core;
using Budgie.Core.Contracts.Security;
using Budgie.Data.Abstractions;
using Budgie.Framework.Base;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Budgie.Api.Controllers
{
    [Route("api/[controller]")]
    public class CategoriesController : ApiControllerBase
    {
        private readonly IUow _uow;
        private readonly IMapper _mapper;

        public CategoriesController(IUow uow, IMapper mapper, ITokenResolverMiddleware tokenResolver) : base(tokenResolver)
        {
            _uow = uow;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetCategories()
        {
            var categories = _uow.Categories.GetAll().ToList();
            var model = _mapper.Map<IList<Category>, IEnumerable<ApiCategory>>(categories);

            return new JsonResult(model);
        }

        [HttpPut]
        public async Task<IActionResult> AddCategory([FromBody] ApiCategory model)
        {
            var category = new Category
            {
                UserId = Token.UserId,
                Name = model.Name,
                Type = model.Type,
                ColourHex = model.ColourHex,
                DateAdded = DateTime.UtcNow
            };

            _uow.Categories.Add(category);
            await _uow.CommitAsync();

            model = _mapper.Map<Category, ApiCategory>(category);

            return new JsonResult(model);
        }

        [HttpPatch]
        [Route("edit")]
        public async Task<IActionResult> EditCategory([FromBody] ApiCategory model)
        {
            var category = await _uow.Categories.GetByIdAsync(model.Id);

            category.Name = model.Name;
            category.Type = model.Type;
            category.ColourHex = model.ColourHex;
            category.DateModified = DateTime.UtcNow;

            _uow.Categories.Update(category);
            await _uow.CommitAsync();

            model = _mapper.Map<Category, ApiCategory>(category);

            return new JsonResult(model);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task DeleteCategory(int id)
        {
            _uow.Categories.Delete(id);
            await _uow.CommitAsync();
        }
    }
}